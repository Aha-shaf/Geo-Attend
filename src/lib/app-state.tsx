import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  attendanceHistory,
  employeeClientVisits,
  employeeWfhRequests,
  initialNotifications,
  teamClientVisits,
  teamWfhRequests,
  type AppNotification,
  type AttendanceRecord,
  type AttendanceStatus,
  type ClientVisitRequest,
  type RequestStatus,
  type WfhRequest,
} from "./mock-data";

export interface PushNotice {
  id: string;
  kind: "geofence-entry" | "geofence-exit" | "client-arrival";
  title: string;
  body: string;
  target: "checkin" | "checkout";
  location: string;
}

interface AppState {
  status: AttendanceStatus;
  checkInAt: Date | null;
  checkOutAt: Date | null;
  breakStartedAt: Date | null;
  accumulatedBreakMs: number;
  faceVerified: boolean;
  insideGeofence: boolean;
  distanceMeters: number;
  history: AttendanceRecord[];
  visits: ClientVisitRequest[];
  wfh: WfhRequest[];
  teamVisits: ClientVisitRequest[];
  teamWfh: WfhRequest[];
  notifications: AppNotification[];
  geofencePromptSeen: boolean;
  push: PushNotice[];
  activeLocation: string;
}

interface AppActions {
  checkIn: () => void;
  checkOut: () => void;
  startBreak: () => void;
  endBreak: () => void;
  setInsideGeofence: (v: boolean) => void;
  markPromptSeen: () => void;
  addVisit: (v: Omit<ClientVisitRequest, "id" | "status">) => void;
  addWfh: (w: Omit<WfhRequest, "id" | "status">) => void;
  decideVisit: (id: string, status: RequestStatus) => void;
  decideWfh: (id: string, status: RequestStatus) => void;
  markNotificationsRead: () => void;
  dismissPush: (id: string) => void;
  simulateClientArrival: (client: string) => void;
  reset: () => void;
}

const initialState: AppState = {
  status: "not-checked-in",
  checkInAt: null,
  checkOutAt: null,
  breakStartedAt: null,
  accumulatedBreakMs: 0,
  faceVerified: false,
  insideGeofence: false,
  distanceMeters: 640,
  history: attendanceHistory,
  visits: employeeClientVisits,
  wfh: employeeWfhRequests,
  teamVisits: teamClientVisits,
  teamWfh: teamWfhRequests,
  notifications: initialNotifications,
  geofencePromptSeen: false,
  push: [],
  activeLocation: "Northgate Corporate Park — HQ",
};

const AppStateContext = createContext<(AppState & AppActions) | null>(null);

let idCounter = 0;
const nextId = (prefix: string) => `${prefix}-${Date.now()}-${idCounter++}`;

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const checkIn = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "checked-in",
      checkInAt: new Date(),
      checkOutAt: null,
      faceVerified: true,
      accumulatedBreakMs: 0,
      breakStartedAt: null,
      push: [],
    }));
  }, []);

  const checkOut = useCallback(() => {
    setState((s) => ({
      ...s,
      status: "checked-out",
      checkOutAt: new Date(),
      breakStartedAt: null,
      push: [],
    }));
  }, []);

  const startBreak = useCallback(() => {
    setState((s) =>
      s.status === "checked-in" ? { ...s, status: "on-break", breakStartedAt: new Date() } : s,
    );
  }, []);

  const endBreak = useCallback(() => {
    setState((s) => {
      if (s.status !== "on-break" || !s.breakStartedAt) return s;
      return {
        ...s,
        status: "checked-in",
        accumulatedBreakMs: s.accumulatedBreakMs + (Date.now() - s.breakStartedAt.getTime()),
        breakStartedAt: null,
      };
    });
  }, []);

  const setInsideGeofence = useCallback((v: boolean) => {
    setState((s) => {
      if (s.insideGeofence === v) return s;
      const next: AppState = {
        ...s,
        insideGeofence: v,
        distanceMeters: v ? 84 : 640,
        geofencePromptSeen: v ? s.geofencePromptSeen : false,
      };
      if (v && s.status === "not-checked-in") {
        next.push = [
          {
            id: nextId("push"),
            kind: "geofence-entry",
            title: "GeoAttend · Attendance",
            body: "You have entered the authorized office area. Tap to record your attendance.",
            target: "checkin",
            location: s.activeLocation,
          },
          ...s.push,
        ];
      }
      if (!v && (s.status === "checked-in" || s.status === "on-break")) {
        next.push = [
          {
            id: nextId("push"),
            kind: "geofence-exit",
            title: "GeoAttend · Attendance",
            body: "You are leaving the authorized work area. Tap to complete check-out.",
            target: "checkout",
            location: s.activeLocation,
          },
          ...s.push,
        ];
      }
      return next;
    });
  }, []);

  const dismissPush = useCallback(
    (id: string) => setState((s) => ({ ...s, push: s.push.filter((p) => p.id !== id) })),
    [],
  );

  const simulateClientArrival = useCallback((client: string) => {
    setState((s) => ({
      ...s,
      insideGeofence: true,
      distanceMeters: 62,
      activeLocation: client,
      push: [
        {
          id: nextId("push"),
          kind: "client-arrival",
          title: "GeoAttend · Client visit",
          body: "You have arrived at the approved client location. Tap to check in.",
          target: "checkin",
          location: client,
        },
        ...s.push,
      ],
    }));
  }, []);

  const markPromptSeen = useCallback(
    () => setState((s) => ({ ...s, geofencePromptSeen: true })),
    [],
  );

  const addVisit = useCallback((v: Omit<ClientVisitRequest, "id" | "status">) => {
    const record: ClientVisitRequest = { ...v, id: nextId("cv"), status: "Pending" };
    setState((s) => ({
      ...s,
      visits: [record, ...s.visits],
      teamVisits: [record, ...s.teamVisits],
    }));
  }, []);

  const addWfh = useCallback((w: Omit<WfhRequest, "id" | "status">) => {
    const record: WfhRequest = { ...w, id: nextId("w"), status: "Pending" };
    setState((s) => ({ ...s, wfh: [record, ...s.wfh], teamWfh: [record, ...s.teamWfh] }));
  }, []);

  const decideVisit = useCallback((id: string, status: RequestStatus) => {
    setState((s) => ({
      ...s,
      visits: s.visits.map((v) => (v.id === id ? { ...v, status } : v)),
      teamVisits: s.teamVisits.map((v) => (v.id === id ? { ...v, status } : v)),
    }));
  }, []);

  const decideWfh = useCallback((id: string, status: RequestStatus) => {
    setState((s) => ({
      ...s,
      wfh: s.wfh.map((w) => (w.id === id ? { ...w, status } : w)),
      teamWfh: s.teamWfh.map((w) => (w.id === id ? { ...w, status } : w)),
    }));
  }, []);

  const markNotificationsRead = useCallback(() => {
    setState((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  }, []);

  const reset = useCallback(() => setState(initialState), []);

  const value = useMemo(
    () => ({
      ...state,
      checkIn,
      checkOut,
      startBreak,
      endBreak,
      setInsideGeofence,
      markPromptSeen,
      addVisit,
      addWfh,
      decideVisit,
      decideWfh,
      markNotificationsRead,
      dismissPush,
      simulateClientArrival,
      reset,
    }),
    [
      state,
      checkIn,
      checkOut,
      startBreak,
      endBreak,
      setInsideGeofence,
      markPromptSeen,
      addVisit,
      addWfh,
      decideVisit,
      decideWfh,
      markNotificationsRead,
      dismissPush,
      simulateClientArrival,
      reset,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside AppStateProvider");
  return ctx;
}

/** Ticking clock that only starts after hydration to avoid SSR mismatches. */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
