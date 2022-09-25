import { useState } from "react";

export default function useLocalStorage<V>(
    key: string,
    initialValue: V
): [V, (newValue: V) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<V>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return (item ? JSON.parse(item) : initialValue) as V;
        } catch (error) {
            // If error also return initialValue
            // eslint-disable-next-line no-console
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: V | ((value: V) => V)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            // eslint-disable-next-line no-console
            console.log(error);
        }
    };
    return [storedValue, setValue];
}
