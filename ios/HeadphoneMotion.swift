import CoreMotion

extension Double {
  func toDeg() -> Double { return 180 / .pi * self }
}

extension  CMDeviceMotion {
    func toDict() -> NSDictionary {
        let attitude = NSMutableDictionary();
        attitude["roll"] = self.attitude.roll
        attitude["rollDeg"] = self.attitude.roll.toDeg()
        attitude["pitch"] = self.attitude.pitch
        attitude["pitchDeg"] = self.attitude.pitch.toDeg()
        attitude["yaw"] = self.attitude.yaw
        attitude["yawDeg"] = self.attitude.yaw.toDeg()

        let rotationRate = NSMutableDictionary();
        rotationRate["x"] = self.rotationRate.x
        rotationRate["y"] = self.rotationRate.y
        rotationRate["z"] = self.rotationRate.z

        let userAcceleration = NSMutableDictionary();
        userAcceleration["x"] = self.userAcceleration.x
        userAcceleration["y"] = self.userAcceleration.y
        userAcceleration["z"] = self.userAcceleration.z

        let gravity = NSMutableDictionary();
        gravity["x"] = self.gravity.x
        gravity["y"] = self.gravity.y
        gravity["z"] = self.gravity.z

        return NSDictionary(dictionary: [
            "attitude":  attitude,
            "rotationRate": rotationRate,
            "userAcceleration": userAcceleration,
            "gravity": gravity
        ]);
    }
}

@objc(HeadphoneMotionModule)
class HeadphoneMotionModule : RCTEventEmitter, CMHeadphoneMotionManagerDelegate {
    private var hasListeners = false

    private var _manager: Any? = nil
    @available(iOS 14.0, *)
    fileprivate var manager: CMHeadphoneMotionManager {
        if _manager == nil {
            _manager = CMHeadphoneMotionManager()
        }
        return _manager as! CMHeadphoneMotionManager
    }

    override init() {
        super.init()
        if #available(iOS 14.0, *) {
          manager.delegate = self;
        }
    }

    @objc
    override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    override func supportedEvents() -> [String]! {
        return [
            "onDeviceMotionUpdates",
            "onDeviceMotionUpdatesError",
            "onHeadphoneConnected",
            "onHeadphoneDisconnected"
        ]
    }

    @objc
    override func startObserving() {
        hasListeners = true
    }

    @objc
    override func stopObserving() {
        hasListeners = false
    }

    override func constantsToExport() -> [AnyHashable : Any] {
        if #available(iOS 14.0, *) {
            return ["isHeadphoneMotionAvailable": manager.isDeviceMotionAvailable]
        } else {
            return ["isHeadphoneMotionAvailable": false]
        }
    }

    @objc
    func getAuthorizationStatus(_ resolve: RCTPromiseResolveBlock,
                                rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            resolve(CMHeadphoneMotionManager.authorizationStatus().rawValue)
        } else {
            resolve(nil)
        }
    }

    @objc
    func isDeviceMotionActive(_ resolve: RCTPromiseResolveBlock,
                              rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            resolve(manager.isDeviceMotionActive)
        } else {
            resolve(false)
        }
    }

    @objc
    func getLatestDeviceMotion(_ resolve: RCTPromiseResolveBlock,
                               rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            resolve(manager.deviceMotion?.toDict() ?? nil)
        } else {
            resolve(nil)
        }
    }

    @objc
    func startListenDeviceMotionUpdates(_ resolve: RCTPromiseResolveBlock,
                                  rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            manager.startDeviceMotionUpdates(to: .main, withHandler: { [self] (deviceMotion, error) -> Void in
                if let motion = deviceMotion {
                    sendEvent(withName: "onDeviceMotionUpdates", body: motion.toDict());

                } else {
                    sendEvent(withName: "onDeviceMotionUpdatesError", body: [
                        "text": error?.localizedDescription ?? ""
                    ]);
                }
            })
        }
        resolve(nil)

    }

    @objc
    func stopDeviceMotionUpdates(_ resolve: RCTPromiseResolveBlock,
                                 rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            manager.stopDeviceMotionUpdates()
        }
        resolve(nil);

    }

    @objc
    func startDeviceMotionUpdates(_ resolve: RCTPromiseResolveBlock,
                                               rejecter reject: RCTPromiseRejectBlock) {
        if #available(iOS 14.0, *) {
            manager.startDeviceMotionUpdates()
        }
        resolve(nil)
    }
}

extension HeadphoneMotionModule {
    @available(iOS 14.0, *)
    func headphoneMotionManagerDidConnect(_ manager: CMHeadphoneMotionManager) {
        sendEvent(withName: "onHeadphoneConnected", body: nil);
    }

    @available(iOS 14.0, *)
    func headphoneMotionManagerDidDisconnect(_ manager: CMHeadphoneMotionManager) {
        sendEvent(withName: "onHeadphoneDisconnected", body: nil);
    }
}
