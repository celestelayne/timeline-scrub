# Trinidad & Tobago Timeline

A scrubbable, full-screen timeline of the cultural history of Trinidad & Tobago (c. 5900 BC to 1962), where one position along the timeline selects the content shown.

## Language

**Timeline Event**:
A dated occurrence: one row of the source sheet, such as "Emergence of the Bontour complex", shown as a card. It belongs to exactly one Marker, the one at its year.
_Avoid_: Entry, data point, milestone

**Marker**:
A position on the track at one year, drawn as one dot. It holds every Timeline Event that shares that year, so one Marker has one or more cards.
_Avoid_: Stop, tick, point

**Active Marker**:
The Marker nearest the Playhead. It is the only one whose Timeline Events are shown, and the only one drawn filled.
_Avoid_: Current marker, selected marker, hovered marker

**Year**:
The single number that places a Timeline Event on the timeline (the sheet's Start year, negative for BC). A Marker is positioned and labelled by its Year alone.
_Avoid_: Date, start date

**Display date**:
The text a Timeline Event's card shows for when it happened, such as "31 July 1498" or "c. AD 650–800". It can be a day, a range, or an approximation; it never positions anything.
_Avoid_: Date, label

**Cultural Series**:
The named culture or tradition a Timeline Event belongs to, such as Saladoid or Barrancoid. A label on an event, not an event itself. Absent for most post-contact events.
_Avoid_: Culture, tradition, category

**Period**:
The named stretch of history or theme a Timeline Event belongs to, such as Early Ceramic Age, British colonial period, or Emancipation. A label on an event, not an event itself. Periods can overlap in time.
_Avoid_: Era, age, phase, archaeological period

**Playhead**:
The fixed line at the horizontal centre of the track. The timeline moves under it; it never moves.

**Gap**:
The number of years between two consecutive Markers. A span's end year is ignored. Gaps of 100 years or more are labelled on the track.
_Avoid_: Interval, jump

## Flagged ambiguities

- "Cultures and periods are Timeline Events" (earlier wording, from the design handoff) was resolved: Saladoid and the like are Cultural Series, and the events are things that happen within them.
- "Era" is reserved for the BC/AD indicator on a year, not for Period.
- "Archaeological Period" (the sheet's earlier column name) was too narrow for post-contact rows, so the term is Period.
