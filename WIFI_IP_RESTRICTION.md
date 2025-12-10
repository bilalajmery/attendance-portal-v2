# WiFi IP Restriction Feature

## Overview

This feature restricts employees to mark **Present** attendance and **Mark Out Time** only when they are connected to the office WiFi network with IP address: **182.184.79.173**

**Important**: Employees can mark **Leave** or **Off** from any network/location.

## How It Works

### 1. IP Detection

- When an employee opens the dashboard, the system automatically detects their current IP address
- The IP is fetched using multiple public IP detection services for reliability:
  - api.ipify.org
  - api.my-ip.io
  - ipapi.co

### 2. Network Verification

- The detected IP is compared with the allowed office WiFi IP (182.184.79.173)
- A visual indicator shows the network status:
  - ✅ **Green Badge**: Connected to Office WiFi - All features enabled
  - ⚠️ **Amber Badge**: Not on Office WiFi - Present & Mark Out Time disabled
  - 🔄 **Gray Badge**: Checking network status

### 3. Attendance Restrictions

#### When NOT on the office WiFi network:

- ❌ **Present** button is **DISABLED** (requires office WiFi)
- ❌ **Mark Out Time / Early Off** button is **DISABLED** (requires office WiFi)
- ✅ **Leave** button is **ENABLED** (can be marked from anywhere)
- ✅ **Off** button is **ENABLED** (can be marked from anywhere)
- An amber warning banner appears explaining which actions require office WiFi

#### When ON the office WiFi network:

- ✅ All buttons are enabled
- Green "Office WiFi" badge shows connection status

### 4. Admin Override

- Admins can mark attendance for employees from any location
- The IP restriction only applies when `markedBy === "self"`
- Admin-marked attendance bypasses the network check

## Files Modified

### New Files

- `src/lib/ipRestriction.ts` - Core IP verification logic

### Modified Files

- `src/lib/firestore.ts` - Added network verification for Present and Early Off only
- `src/routes/employee/Dashboard.tsx` - Added UI indicators and selective button restrictions

## Configuration

To change the allowed IP address, edit the `ALLOWED_IP` constant in:

```typescript
// src/lib/ipRestriction.ts
const ALLOWED_IP = "182.184.79.173";
```

## Error Handling

If an employee tries to mark **Present** from outside the office WiFi:

- The backend will throw an error: "Access denied. You must be connected to the office WiFi network..."
- The error message includes the employee's current IP for debugging
- The Present button is visually disabled to prevent attempts

**Note**: Leave and Off marking will work from any network without errors.

## User Experience

### 1. On Office WiFi:

- Green "Office WiFi" badge in header
- All attendance buttons are enabled
- Normal attendance marking flow

### 2. Outside Office WiFi:

- Amber "Not Connected" badge in header
- Amber warning banner at top of page
- **Present** button is disabled and grayed out
- **Mark Out Time** button is disabled and grayed out
- **Leave** and **Off** buttons remain enabled
- Clear message explaining which actions require office WiFi

## Testing

### Test Case 1: On Office WiFi (IP: 182.184.79.173)

1. Connect to the office WiFi
2. Open the employee dashboard
3. Verify green badge appears
4. Verify all buttons (Present, Leave, Off) are enabled
5. Try marking Present - should work ✅
6. Try marking Leave - should work ✅
7. Try marking Off - should work ✅

### Test Case 2: Outside Office WiFi

1. Disconnect from office WiFi (or use different network)
2. Refresh the page
3. Verify amber badge and warning banner appear
4. Verify Present button is disabled ❌
5. Verify Leave button is enabled ✅
6. Verify Off button is enabled ✅
7. Try marking Leave - should work from anywhere ✅
8. Try marking Off - should work from anywhere ✅

## Business Logic

### Why This Design?

- **Present**: Requires physical presence in office → WiFi check ensures employee is actually in office
- **Mark Out Time**: Confirms employee was in office when leaving → WiFi check required
- **Leave**: Pre-planned absence, can be requested from home → No WiFi check needed
- **Off**: Unplanned absence, might be sick at home → No WiFi check needed

## Notes

- The IP check happens on both frontend (UI) and backend (database)
- Frontend check provides immediate visual feedback
- Backend check ensures security even if frontend is bypassed
- Network status is checked once on page load
- Admins are exempt from all restrictions
- Only "Present" and "Early Off" marking require office WiFi
- "Leave" and "Off" can be marked from anywhere for flexibility
