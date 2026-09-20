"use client";

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { useState, type ReactNode } from "react";
import { BookingProvider } from "@/components/booking/BookingContext";
import { GC_TIME, makeQueryClient } from "@/lib/query/client";
import { persistedRoots } from "@/lib/query/keys";
import { CACHE_BUSTER, makePersister } from "@/lib/query/persister";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(makeQueryClient);
  const [persister] = useState(makePersister);

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: GC_TIME,
        buster: CACHE_BUSTER,
        dehydrateOptions: {
          // Availability is worth keeping for the session. Anything that could
          // hold customer details (bookings) never touches storage.
          shouldDehydrateQuery: (query) =>
            query.state.status === "success" && persistedRoots.has(String(query.queryKey[0])),
        },
      }}
    >
      <BookingProvider>{children}</BookingProvider>
    </PersistQueryClientProvider>
  );
}
