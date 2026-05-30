---
globs: ["android/**", "src/**/*.android.ts", "src/**/*.android.tsx", "src/services/alarm*", "src/modules/**"]
---

# Android Rules

## Target

- Target SDK: 34
- Min SDK: 26 (Android 8.0+)
- Kotlin for all native module code

## Permissions

- Never assume a permission is granted — always check first, then request
- When adding a permission: add to `AndroidManifest.xml` AND handle the request flow in JS
- Required permissions for alarm functionality:
  - `SCHEDULE_EXACT_ALARM` (Android 12+)
  - `USE_EXACT_ALARM` (Android 13+)
  - `FOREGROUND_SERVICE`
  - `FOREGROUND_SERVICE_MEDIA_PLAYBACK`
  - `RECEIVE_BOOT_COMPLETED`
  - `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`

## Alarm Reliability

This is the #1 technical risk. Alarms must fire on Samsung/Xiaomi/OnePlus with screen off and battery saver on.

- Use `AlarmManager.setAlarmClock()` — not `setExact()` alone
- Launch alarms as foreground service — prevents OS kill mid-dismiss
- Acquire `PARTIAL_WAKE_LOCK` when alarm fires, release after dismiss
- Prompt user to disable battery optimization on first launch
- Use AutoStarter for OEM-specific battery optimization deep links (Samsung AutoStart, MIUI AutoStart, etc.)

## Native Modules (Kotlin)

- All Kotlin native modules live in `android/app/src/main/java/`
- Module class name must end in `Module`, package name must end in `Package`
- Always register new modules in `MainApplication.kt`
- Test alarm native module manually on: Samsung (One UI), Xiaomi (MIUI), OnePlus (OxygenOS), stock Android emulator
