**[Click here to head to the Chrome Web Store and install!](https://chromewebstore.google.com/detail/ngclhnocakhkdieeecnieijcponodabm?authuser=0&hl=en)**

## 1. ExtensionRequests List Page Enhancements

Features designed to improve navigation and management of requests on the main list view.

*   **Default List Selection**: The page will default to the "Unassigned" list if it contains one or more requests.
*   **Alternate Row Colors**: Rows will display with alternating background colors to improve scannability and visual separation of individual requests.
*   **Open Links in New Tab**: Links to individual requests will be modified to open in a new browser tab, preserving the current list view.
*   **Remove Non-Clickable Pointer Cursor**: The pointer cursor will be removed on hover for items within rows that are not interactive, preventing user confusion.
*   **Private Note Toggle**: The standard "Incident" icon will be replaced with a toggleable "Private Note" feature. These notes are stored in the extension's local storage and are persistent (will not clear with browser cache).
*   **Resizable Filter Lists & Apply on Enter**: Lists within the filter section (e.g., status, technician) will be made resizable. Additionally, pressing "Enter" within these lists will trigger the "Apply" action for the filters.
*   **Improved Navigation Bar Request Link**: The "Requests" link in the navigation bar will be updated to `https://support.wmed.edu/LiveTime/WebObjects/LiveTime` to mitigate common session expiration issues.

---

## 2. Opened Request Page Enhancements

Features focused on improving the experience when viewing and working on an individual request.

*   **Dynamic Tab Title & Favicon**: The browser tab's title will be changed from "Service Manager" to the subject of the opened request. The favicon will also be updated to a document icon for easier identification.
*   **Live Presence Indicator**: A banner will appear at the top of the request page stating `[Tech's Full Name] is also viewing this ticket` if other technicians (who also have this extension installed) are simultaneously viewing the same request. This banner automatically disappears when no other technicians are present.
*   **Automatic "Read More"**: The "Read More" link within the request's description will be automatically clicked on page load, expanding the full description.
*   **Resizable Description Div**: The division containing the request description will be made resizable, offering greater flexibility and reducing the need for the LiveTime fullscreen button.
*   **Automatic Notes Section Open**: If an opened request contains any existing notes, the notes section will automatically expand upon page load.
*   **"Save + Close" Button**: A new "Save + Close" button will be added. Upon clicking, it will save the current request, then close the tab after a short delay to ensure the save operation completes. It will also send a message to any open "Requests List" tabs to refresh their view, reflecting any changes made.
*   **Persistent Customer Info Button**: The transient customer info tooltip (the "i" icon next to the customer field in the "General" section) will be replaced with a static info button. Clicking this button will display the customer's information, which will remain open until clicked off.
*   **WMed Directory Profile Link**: Within the customer information section (displayed via the persistent info button), a direct link to the user's profile in the WMed Directory will be added. This link will not appear for "System User" accounts.
*   **Alternate Colors in Select Lists**: Dropdown and select lists (e.g., for assigning technicians) will display alternating row colors for improved readability.

---

## 3. Report "Macro"

A feature that automates access and pre-fills the "Incidents Status by Technician (Closed)" report.

*   **Macro Activation Checkbox**: A checkbox will be visible on the Technician report page. Enabling this checkbox activates the report macro.
*   **Bookmark Redirection**: When the macro is enabled, bookmarking `https://support.wmed.edu/LiveTime/WebObjects/LiveTime/reports` (which normally leads to a broken page) will instead redirect to the technician reports and automatically select the "Incidents Status by Technician (Closed)" report.
*   **Automatic Report Pre-fill**: Upon reaching the "Incidents Status by Technician (Closed)" report, the start and end dates for the report will be automatically populated to cover one work week. Additionally, the "IT Support Workflow" will be pre-selected.

---

## 4. Extension Popup (Quick Call Creation Tool)

A standalone tool accessible by clicking the extension's icon, designed for rapid call creation.

*   **SSO Login Requirement**: This tool requires users to log in with their WMed SSO credentials to function.
*   **Streamlined Quick Call Creation**: Facilitates faster creation of common quick call types: "Phone Call," "Walkup," and "Teams Message."
*   **Two Input Fields**:
    *   The first field allows searching for the user the request is about, automatically assigning them as the customer in the ticket.
    *   The second field is for the "General Description," which forms the subject of the ticket, formatted as `[Quick Call Type] - [General Description]`.
*   **Automated Ticket Creation & Link**: Clicking one of the three quick call type buttons will immediately create a new request. A direct link to the newly created request will then appear in the popup, which will close after a brief delay.
*   **Dark Mode Support**: The popup interface includes a dark mode theme, activated by clicking the sun icon located in the top-right corner.

  
If you run into any issues, please let me know!
<br>
<br>
<br>
"The greatest extension not in the app store - wmed employee" - Richard Graziano
