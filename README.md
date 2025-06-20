**[Click here to head to the Chrome Web Store and install!](https://chromewebstore.google.com/detail/ngclhnocakhkdieeecnieijcponodabm?authuser=0&hl=en)**

# Key Features

## 1. Real-time Presence Indicator (Enhanced Collaboration)

A core feature implemented using Firebase to provide real-time insight into who is viewing a ticket.

-   **Live Viewer Tracking**: When a Service Desk ticket is opened, the extension establishes a connection to Firebase Realtime Database. It identifies and displays the full names of other technicians who are also currently viewing that specific ticket. This creates a real-time presence banner, fostering better coordination and preventing duplicate efforts.
-   **Secure & Private**: This feature specifically leverages Firebase Anonymous Authentication. Your WMed Service Desk clientId is used to obtain a custom Firebase authentication token from a secure backend. This token then signs you into Firebase anonymously. This design ensures that the presence tracking identifies unique users for collaboration without collecting, storing, or associating any personally identifiable information (PII) within Firebase itself.
-   **Dynamic Styling**: The presence banner dynamically adjusts its appearance (e.g., colors, icons) to seamlessly integrate with the Service Desk interface, including automatic adjustments if browser extensions like Dark Reader are active.

## 2. Core Service Desk Authentication Handling

The extension manages its own authentication with the Service Desk system's API to enable advanced features like quick ticket creation and user lookups directly from the pop-up.

-   **Automatic Token Refresh**: Automatically checks for valid authentication tokens (Auth and Refresh tokens) and attempts to refresh them when needed to maintain seamless access to Service Desk APIs, preventing interruptions.
-   **Integrated Login**: If tokens are invalid or expired, a user-friendly login form is presented directly within the extension's pop-up. This allows users to re-authenticate using their WMed Service Desk username and password without needing to navigate away from the current page.
-   **Client ID Management**: After a user is successfully selected in the pop-up search, their clientId is securely stored and utilized for accurate quick ticket creation via the API.

## 3. Extension Pop-Up (Quick Ticket Creation & User Lookup)

Clicking the extension icon in your Chrome toolbar will open a menu, allowing for rapid ticket creation and efficient user information retrieval.

(The pop-up supports dark mode; click the moon/sun icon to switch themes.)

1.  **Smart User Search**: Type a user's name in the top text box. A debounced search will quickly fetch and display results in a box below.
    -   **Efficient Selection**: Select the desired user by clicking on their name or by using the ArrowUp/ArrowDown keys for navigation and Enter/Space to select.
    -   **Persistent Search**: The search field retains your last searched user's name, and their corresponding clientId for convenience.
2.  **General Description**: Provide a concise general description for the ticket. This text will be automatically prepended with the quickcall type (e.g., "Phone Call - Your Description"). The description input field remembers your last entered value.
3.  **One-Click Ticket Creation**: Click the button corresponding to the type of quickcall ticket you wish to create (Phone Call, Walk-Up, or Teams Message).
    -   **Instant Feedback**: Upon successful ticket creation, a confirmation message will appear with a direct link to the newly created ticket.
    -   **Auto-Close**: The pop-up window will automatically close after 3 seconds, ensuring a smooth workflow.
4.  **Copy Username**: After a user is selected, a "Copy" button appears next to the search field. Clicking it instantly copies the user's Service Desk username to your clipboard, with a visual "Check" mark confirmation.

## 4. Requests List Enhancements (e.g., Incident and My Tasks pages)

Improvements to the main Service Desk request list view for better organization and navigation.

-   **New Tab Links**: All request ID links (\#requestId) are modified to open in a new browser tab, preserving your current list view.
-   **Alternating Background Colors**: The background color of request list items alternates (white/light gray) for enhanced readability and easier scanning.
-   **Auto-Close Confirmation**: The "Request Created" confirmation message will automatically close after a short delay (300 milliseconds).
-   **Persistent Personal Notes**:
    -   An interactive + icon is added next to each request item.
    -   Clicking the + toggles a personal notes text area, allowing you to add private notes specific to that request.
    -   Notes are automatically saved locally in your browser storage (Chrome Sync Storage) and persist across sessions, even if the request is closed or you navigate away.
    -   Notes automatically save upon typing or resizing the text area.
    -   Empty notes are automatically removed from storage, keeping it clean.
    -   Notes older than 60 days are automatically pruned from local storage during a routine cleanup.
-   **Improved Filter Input**: Enhances the filter select dropdowns (e.g., for selectedTechnician or selectdTeams) by allowing them to be vertically resizable and enabling the "Enter" key to apply filters.
-   **Consistent Request Page Access**: Automatically redirects non-/LookupRequest URLs of an opened request to the correct /LookupRequest format, ensuring consistent functionality and enabling openedRequest.js features.
-   **Default Incident View**: On the main incident/task list, if there are pending incidents (sup count > 0), the extension will automatically switch to the "Incident" tab to bring them into view by default.
-   **Streamlined Navigation Bar**: The main "Requests" button in the top navigation bar is modified to point directly to the base Service Desk URL (https://support.wmed.edu/LiveTime/WebObjects/LiveTime), preventing potential session expiration issues associated with longer, specific URLs.

## 5. Reports Page Enhancements (/reports URL)

Specialized features for navigating and viewing reports.

-   **Custom Favicon**: Changes the browser tab's favicon to a unique "alien icon" when on a reports page, providing a clear visual cue in your browser tabs.
-   **Automated Technician Report View**:
    -   An optional feature (controlled by a checkbox on the "Technician Reports" page).
    -   If enabled, when you navigate to the "KPI" report, it will automatically redirect you to the "Requests Status by Technician (Closed)" report.
    -   It then automatically sets the report's date range to the current week (Monday to Friday) and sets the workflow filter to "Closed".
    -   The browser tab's title dynamically updates to reflect the name of the selected report.

## 6. Request Page Enhancements (when a specific request is opened)

Significant quality-of-life improvements for individual ticket pages.

-   **Custom Favicon**: Changes the browser tab's favicon to a unique "request icon" (request.ico) when a specific request is opened, making it easily identifiable.
-   **Dynamic Tab Title**: The browser tab's title dynamically updates to display the subject of the currently viewed request, pulled directly via an API call for accuracy.
-   **"Save And Close" Button**: A new "SAVE + CLOSE" button is added next to the standard "Save" button. Clicking this will save all changes to the ticket and automatically close the current browser window after a short delay (800 milliseconds), streamlining the closing process for resolved tickets.
-   **Enhanced User Tooltip**: The information icon (i tag) next to the user's name is made clickable. Clicking it toggles the user tooltip, allowing for easier viewing of user details. Clicking outside the tooltip will also close it.
    -   **Direct Directory Link**: Within the user tooltip, a new link "Open User in Directory" is added, providing quick access to the user's profile in the WMed directory.
-   **Improved Description Styling**:
    -   The description text area is made vertically resizable, allowing users to expand or shrink it as needed to comfortably view or edit long descriptions. It automatically expands to show full content if a "READ MORE" link is present.
    -   Email conversations within the description are parsed and displayed with alternating background colors for each From: section, significantly improving the readability of long email threads.
-   **Styled Select Options**: Options within dropdown menus (`<select>`) are styled with alternating background colors for improved visual separation and readability.
-   **Auto-Open Notes Section**: If a request contains notes (indicated by a count greater than zero in the "NOTES" section header), the "Notes" section will automatically expand when you open the request page, ensuring immediate visibility of existing communications.

If you run into any issues, please let me know!
<br>
<br>
<br>
"The greatest extension not in the app store - wmed employee" - Richard Graziano
