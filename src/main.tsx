import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/bootstrap.scss";
import { router } from "@/routes";
import { writeClient } from "@/apollo/writeClient";
import { ActionNotificationsProvider } from "@/components/ActionsNotification";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ApolloProvider client={writeClient}>
            {/* Mount the toast provider ONCE for the whole app */}
            <ActionNotificationsProvider>
                <RouterProvider router={router} />
            </ActionNotificationsProvider>
        </ApolloProvider>
    </React.StrictMode>
);
