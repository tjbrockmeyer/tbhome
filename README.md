# Requirements
* For the API: A .env file containing the following variables:
  * API_HOST - The hostname for the api (localhost/192.168.x.x/etc.)
  * API_PORT - The port for the api (80/8080/3001/etc.)
  * DOMAIN_URL - The domain for the api: where the api will be visible to external clients 
    (scheme://$API_HOST:$API_PORT unless hosting behind a proxy: http(s)://subdomain.domain.tld)
  * PG_HOST - The hostname for the postgres database
  * PG_PORT - The port for the postgres database (usually 5432)
  * PG_USER - The user for the postgres database (usually postgres)
  * PG_PASS - The password for the postgres database
  * PG_NAME - The database name
* For the Client (home): A .env file containing the following variables:
  * REACT_APP_API_URL - The full url to access the API. Typically, the same as DOMAIN_URL from above.

## Lists
* Open/Closed status.
* Unique identification `{date}{name}` where `date` is nullable for unclosed lists.
* Multiple lists
  * Allow creating new list with the same name if the existing lists are already closed.
  * Lists with the same name should be shown in folders sorted by date.
    * The current list with that name should be available without entering the folder.
* List of items including:
  * `name`
  * `description`
* Closing must not delete the list
  * Date it, and mark it as closed.

## Tasks / Events
* Specify recurrence:
  * NonRecurring: `date`
  * Annually: `month + day`
  * Semiannually: `month1 + day`
  * Quarterly: `month1 + day`
  * Monthly: `day`
  * Bimonthly: `day1`
  * Weekly: `dayOfWeek`
  * Daily: `hour`
  * HighFrequency: `none` *These events occur too quickly to warrant tracking*
* End date.
* Specify task, and a description.
* **OPTIONALLY** images.
* Must have Assigners.
* Non-mandatory Assignees.
  * Support groups of assignees.
  * Support rotating assignees.
* Should be able to be marked as completed by the assignee(s) or the assigner.
  * Track who set it to completed.
* Events should be able to be deleted, but completed events should remain.

## Calendar
* Show events.
* Ability to filter out certain types of events.
* Show holidays.
