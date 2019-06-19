# Requirements

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
