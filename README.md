**[Click here to head to the Chrome Web Store and install!](https://chromewebstore.google.com/detail/ngclhnocakhkdieeecnieijcponodabm?authuser=0&hl=en)**

# LiveTime Extension Features

---

## Requests List Page

*   **Default to Unassigned list**: If there is > 0 in the list.
*   **Alternate row colors**: To improve scannability and visual separation.
*   **Modify links to open in new tab**: For requests.
*   **Remove Pointer cursor on hover**: For non-clickable items in rows.
*   **Replace Incident icon with Private Note**: A toggleable private note stored in the extension's local storage (this will not clear when you clear cache).
*   **Resizable filter lists & Enter to apply**: Change lists in the filter section to be resizable and allow enter in the lists to hit apply.
*   **Change Nav bar Requests link**: To `https://support.wmed.edu/LiveTime/WebObjects/LiveTime` in order to remove some of the session expiration issues.

---

## Opened Request Page

*   **Modify tab's title and favicon**: The tab's title will be the subject of the request from "Service Manager" and the favicon will change to a document icon.
*   **Add Live Presence**: If there are any other technicians (who also have this extension installed), a banner at the top of the request will show stating "[tech's full name] is also viewing this ticket". This will automatically remove itself when there are no other techs looking at the request.
*   **Automatically click "Read More"**: In the request's description.
*   **Resizable description div**: Modify the div that holds the description to be resizable (these 2 have completely removed my use of the Fullscreen button).
*   **Automatically open notes section on load**: If there were any on the request.
*   **Add "Save + Close" button**: That saves the request then closes the tab on a delay to ensure saving, then sends a message to any tab on the Requests List page to refresh the list to catch any modifications you may have had.
*   **Replace customer info tooltip with info button**: The "i" icon next to the customer field in the "General" section will be replaced with an info button that stays open unless clicked off.
*   **Add WMed Directory profile link**: Inside the information section that shows when the info button is clicked - this will not show if the user is System User.
*   **Alternate colors in select lists**: For example, the list to select a technician to send the request to.

---

## Report "Macro"

If you navigate to the Technician report, you will see a checkbox; this enables the macro.

When enabled:
*   **Bookmark redirection**: You can bookmark `https://support.wmed.edu/LiveTime/WebObjects/LiveTime/reports` which normally returns a broken page; it will redirect to the technician reports and select the "Incidents Status by Technician (Closed)" report.
*   **Automatic report pre-fill**: Once you get to the "Incidents Status by Technician (Closed)", the start date and end date for the report will be filled out for one work week and select the IT support Workflow.

---

## Extension Popup (Click the Extension's Icon)

### Quick Call Creation Tool

*   **Requires SSO login**: You must login with your SSO login.
*   **Allows quick call creation**: This tool allows you to create quick calls (Phone Call, Walkup, Teams Message) faster.
*   **Two input fields**:
    *   The first field is to search for the user the request is about (this assigns the user as the customer in the ticket).
    *   The second is the "General Description" (the subject in the ticket which formats as `[quick call type] - [General Description]`).
*   **Automated call creation and link**: Once you click one of the 3 buttons that determines the quick call type, a quick call will be created and a link to the request, once created, will be added to the popup, then close after a delay.
*   **Dark mode enabled**: Simply click the sun icon in the top right to change the theme.
If you run into any issues, please let me know!
<br>
<br>
<br>
"The greatest extension not in the app store - wmed employee" - Richard Graziano
