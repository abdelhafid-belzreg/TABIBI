import { useState, useCallback } from "react";

let listeners = [];
let toasts = [];
let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

function dispatch(action) {
  switch (action.type) {
    case "ADD_TOAST":
      toasts = [action.toast, ...toasts].slice(0, 5); // max 5 toasts
      break;
    case "DISMISS_TOAST":
      toasts = toasts.map((t) =>
        t.id === action.id || action.id === undefined
          ? { ...t, dismissed: true }
          : t
      );
      // auto remove after animation
      setTimeout(() => dispatch({ type: "REMOVE_TOAST", id: action.id }), 300);
      break;
    case "REMOVE_TOAST":
      toasts = action.id === undefined
        ? []
        : toasts.filter((t) => t.id !== action.id);
      break;
  }
  listeners.forEach((l) => l([...toasts]));
}

// ✅ Global toast function — use anywhere without hooks
export function toast({ title, description, variant = "success", duration = 4000 }) {
  const id = genId();

  dispatch({
    type: "ADD_TOAST",
    toast: { id, title, description, variant, dismissed: false },
  });

  // auto dismiss
  setTimeout(() => dispatch({ type: "DISMISS_TOAST", id }), duration);

  return {
    id,
    dismiss: () => dispatch({ type: "DISMISS_TOAST", id }),
    update:  (props) => dispatch({ type: "ADD_TOAST", toast: { id, ...props } }),
  };
}

// ✅ Convenience helpers
toast.success = (title, description) => toast({ title, description, variant: "success" });
toast.danger   = (title, description) => toast({ title, description, variant: "danger"  });
toast.warning  = (title, description) => toast({ title, description, variant: "warning" });
toast.info     = (title, description) => toast({ title, description, variant: "info"    });

// ✅ Hook to use inside components
export function useToast() {
  const [state, setState] = useState([...toasts]);

  const stableSet = useCallback((val) => setState(val), []);

  useState(() => {
    listeners.push(stableSet);
    return () => {
      listeners = listeners.filter((l) => l !== stableSet);
    };
  });

  return {
    toasts: state,
    toast,
    dismiss: (id) => dispatch({ type: "DISMISS_TOAST", id }),
    dismissAll: ()  => dispatch({ type: "REMOVE_TOAST" }),
  };
}