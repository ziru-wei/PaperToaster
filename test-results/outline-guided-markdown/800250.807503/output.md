```
"Put-That-There": Voice and Gesture
at the Graphics Interface
Richard A. Bolt
Architecture Machine Group
Massachusetts Institute of Technology
Cambridge, Massachusetts 02139
ABSTRACT
```

```
Recent technological advances in connected-speech recognition and position sensing
in space have encouraged the notion that voice and gesture inputs at the graphics
interface can converge to provide a concerted, natural user modality.
The work described herein involves the user commanding simple shapes about a
large-screen graphics display surface. Because voice can be augmented with
simultaneous pointing, the free usage of pronouns becomes possible, with a
corresponding gain in naturalness and economy of expression. Conversely,
gesture aided by voice gains precision in its power to reference.
```

```
Key Words: Voice input; speech input; gesture; space sensing; spatial data
management; man-machine interfaces; graphics; graphics interface.
```

```
Category Numbers: 8.2, 6.9.
The work reported herein has been supported by the Cybernetics Technology
Division of the Defense Advanced Research Projects Agency, under Contract
No. MDA-903-77-C-0037.
```

```
Permission to copy without fee all or part of this material is
granted provided that the copies are not made or distributed
for direct commercial advantage, the ACM copyright notice and
G9980 ACM 0-8979]-02]-4/80/0700-262 $00.75
```

```
the title of the publication and its date appear, and notice
is given that copying is by permission of the Association for
Computing Machinery. To copy otherwise, or to republish,
requires a fee and/or specific permission.
```

-----

```
INTRODUCTION
```

| Recently, | the Architecture Technology has been experimenting | Machine Group at the Massachusetts |
|---|---|---|
| gesture-recognition graphics display. |  | to command events on a large format raster-scan |
| Of central | actions in one modality amplifying, | interest is how voice and gesture can be made to inter-orchestrate, |
| the other. | effectively as "temporary variables" | The approach involves the significant |
| The interactions |  | to be described are staged in the MIT Architecture |
| Group's | "Media Room," literally a room into which one steps, | a physical |

```
which one is perched.
The Media Room Sketched in Figure i, is the size of a personal office:
```

| to ceiling. of | about sixteen feet long, mini-computers | eleven feet wide, The floor is raised to accommodate which drives displays |
|---|---|---|
| Room. loudspeakers | The walls, | finished in dark brown pile fabric, on either side of a wall-sized, |
| screen, |  | and on either side and a bit to the rear of the user's chair. |

| The user's chair | is a | vinyl-covered |
|---|---|---|
| the furniture arms. | store, Either arm bears a small, | except for two types of instumentation |
| displacing variety, | joystick is a two-inch on edge, | sensitive to pressure and direction. |

```
Institute of
with the conjoint use of voice-input and
```

| modifying, | disambiguating, use of pronouns, | actions | in |
|---|---|---|---|
| to reference | items on the display. |  |  |

```
Machine
facility where the user's terminal is
rather than a desk-top CRT before
```

```
and about eight feet from floor
cabling from an ensemble
and devices resident in the Media
house banks of
frosted-glass projection
```

| Eames-type | chair, | exactly as comes from based in its |
|---|---|---|
| one-inch high joystick, |  | of the non- Nearby each |
| square-shaped |  | touch sensitive pad. |

F `i~,` L\_..~

# I

"\_-~ : = = .~

```
i i ! 1
....
```

r ("::1 I

```
I
```

r.i i `i`

**I""- L-"."** "',

**i i**

```
[I
i i
i i
i I I
!/ I
```

***iii***

# I I,

# I i I L

***l***

```
Figure 1
Sketch of Media Room
```

-----

| The wall-sized screen, back-projection | about eight feet to the user's front, from a color TV light-valve projector situated in an | is served by |
|---|---|---|
| adjoining room. | Color TV monitors are situated on either side of the user's |  |
| chair, pad. | each with its tube face overlain with a transparent, | touch-sensitive |

```python
Apart from its role as an embodiment of the user terminal as an "informational
surround [i]," the Media Room with its user chair has played a key role in
our researches
The specific rationale for spatially indexing data derives from our everyday
experience of retrieving items,
right and above the blotter;
"in-box" nearby the ashtray at the lower left,
natural and automatic
having a spatial logic well-known to its creator and user,
where this and that item are located being encoded conjointly in mental and
motor models of the layout of the desktop.
The user of SDMS retrieves
strings on a keyboard terminal,
touch controls to navigate about in a helicopter-like manner to where specific
caches of information reside in a rich graphics world of color and sound.
The world of information in SDMS, dubbed
upon one of the color TV monitors near-by the user chair.
transparent rectangular overlay,
positioned about Dataland by the user's managing of the chair's right-hand
joystick (or by direct touch on the TV screen,
of the Dataland surface indicated by the "you-are-here"
with increased detail on the large screen,
onto Dataland.
zoom-in upon information to get a closer look at any of a number of multi-
media data-types
perhaps to peruse them with the aid of an associated touch-sensitive
map" which comes up on the Other TV monitor by the user chair.
The Media Room setting,
impression of interacting with an implicit,
the frame of the physical
space rife with possibilities
Media Room itself.
The sheer extent of the Media Room's physical
space" environment.
several screens of various sizes creates a set of geometrical
quite apart from any purely logical relationship between any one screen's
content and that of any other.
Properly orchestrated,
the user's immediate real space in the Media Room,
effectively one continuous
User awareness of this common space is implicit:
references "up,"
naturally, precisely because the user is situated in a real space.
this interactive potential
areas of: I) connected speech recognition;
```

| into a "Spatial Data-Management | System, | or SDMS | [2]." |
|---|---|---|---|
| say, | from our desktop: | the phone | to the |

```
the appointment calendar in the lower right; the
and so forth. Retrieval is
for these items, with even an apparently "messy" desk
the knowledge of
```

```
information not by typing names, i.e., alphanumeric
but instead uses joystick and, occasionally,
```

| "Dataland," |  | appears in its entirety A small |
|---|---|---|
| a "you-are-here" | marker, if desired). | can be moved and That sub-portion rectangle is portrayed |

```
effectively a magnifying window
The left-hand joystick on the user chair enables the user to
(e.g., maps, electronic "books," videodisc episodes), and
"Key-
```

```
in addition to its power to generate a convincing
"virtual" world of data behind
interface, implies yet another realm or order of
for interaction: the actual space of the
```

```
interface creates a "real-
The user's focal situation amidst an ensemble of
relationships
```

```
the two spatial orders,
interactive
```

```
"down," "...to the left of...,"
is rooted in--two new technical offerings
```

```
virtual graphical
can converge to become
space.
the user points,
and so on,
```

```
2) position sensing in space.
```

```
space, and
gestures,
freely and
Tapping
in the
```

```
SPEECH AND SPACE: THE TECHNOLOGIES
Two broad categories of currently commercially available speech recognizers
may be distinguished: those which recognize discrete or isolated utterances,
and those which recognize connected speech.
With those speech recognition systems restricted to discrete utterances,
```

| parsing of the speech signal into word-by-word | tokens, is not done. | The |
|---|---|---|
| human speaker must talk to the system in a "clipped" | or word-by-word | style. |

-----

```
The recognition of connected speech has been a classic challenge
of speech recognition generally
System (CSRS) by NEC
limited amount of recognition of connected speech
is necessary,
sentence.
The recognition response time at the end of each sentence is about 300
milliseconds.
alphanumeric visual display,
to be received by a processor interfaced with the NEC system.
The device's vocabulary,
word reference patterns,
"discrete utterance"
memory may be larger,
"ten," which must be spoken twice by the user when "training"
each word in training mode need be spoken only once.
comes with a lightweight,
eventual use of a "shotgun" microphone
aimed at the speaker.
A space position and orientation sensing technology suitable for our
intentions was found to be made by Polhemus Navigation Science,
Essex, Vermont.
Measurement System)
field. Essentials of the system are as follows.
Three coils are epoxied into a plastic cube,
orthogonal
involved:
another, 0.75 inches on edge, which functions as a sensor.
of coils in either cube essentially creates an antenna £hat is sensitive in
all three orientations.
The transmitter cube radiates a nutating dipole field pointed at the sensor
```

| cube. | When the pointing vector is correct, |
|---|---|
| be | constant. |
| the | nutation frequency. |
| angles, | and to re-aim the transmitter. |

```
The orientation in space of the sensor cube is determined by transforming
the differential
sensor cube.
computed by the i/R 3 fall-off of signal strength from the radiating dipole,
or by triangulation with an additional radiator.
The sensor cube is very lightweight,
running out of it,
sensors can readily be wrist-mounted,
mounted on the visor of baseball caps,
lieu of cuff and collar buttons or epaulets.
```

```
in the field
```

| [3]. | The DP-100 Connected | Speech | Recognition |
|---|---|---|---|
| (Nippon Electric Company) | America, [4]. | Inc. | is capable of a No pause between words |
| and up to five words or "utterances" |  |  | are permitted per spoken |

```
Output is a display of the text of the utterance on an
and/or a set of ASCII codes (numbers or letters)
```

```
held in the recognizer's
is a maximum of 120 words.
mode, the size of the active vocabulary in the system's
about 1000 words.
head-mounted microphone.
```

```python
active memory as a set of
With an optional
Except for the digits "one" to
the machine,
The standard system
We look forward to
in the Media Room, remote from but
```

```
Inc., of
This system, called ROPAMS (Remote Object Position Attitude
is based on measurements made of a nutating magnetic
```

```
their mountings mutually
```

| to correspond to x,y, | and z spatial axes. | Two such cubes are |
|---|---|---|
| one, | about 1.5 inches on edge which acts as a transmitter, | and The arrangement |

```
the field strength received will
When it is not, there will be an error signal consisting of
This error is used to generate the output pointing
```

```
signals from the three individual orthogonal coils in the
The sensor cube's distance from the transmitter cube is
```

```
and although it has a small cord
```

| it is not an especially troublesome worn as finger rings, | item to handle. or put on a sort of "lab jacket" | Such in |
|---|---|---|

```
COMMANDS
Suppose the user seated before the Media Room's large screen, with a
space-sensing cube attached to a watchband on his wrist, and that the system's
microphone is ready and listening. Some commands from the system's current
repertoireillustrativeof voice and pointing in concert are the following:
"Create . . ."
In our demonstration system, the large screen is initially either clear, or
bears some simple backdrop such as a map. Against this background, simple
items are called into existence, moved about, replicated, their attributes
altered, and then may be ordered to vanish.
The items used are basic shapes: circles, squares, diamonds. They are non-
representational in that the thing is the shape. Variable attributes are:
color (red, yellow, orange, green, b-lue. .), and size (large, medium, small).
```

-----

```
For example, the user points to some spot on the large screen.
"x" cursor on the screen provides running visual
user then says:
"Create a blue square there."
The size of the square is not given explicitly
default size, "medium," is used. A blue square appears on the spot where the
user is pointing. There is no default color;
progranuned parent ensemble of color names must be given.
for shape.
Where the feed-back cursor is residing on the screen at the time the spoken
```

| "there" | occurs becomes | the spot where the to-be-created | the spot where the to-be-created |
|---|---|---|---|
| occurrence | of the spoken | "there" | is thus functionally |
| serves as a | "voice button" | for the | x,y cursor action of the pointing gesture. |
| Accordingly, | a | considerable | pause before the occurrence |
| permissible, | i.e.: |  |  |
| "Create a blue square . . there." |  |  |  |
| The complete | utterance | in effect | is a "call" |
| routine expects certain parameters |  |  | to be supplied. |

| "there," | the routine | is parameter hung. |
|---|---|---|
| completing | the conjunction space sensor with the utterance | of x,y pointing "there." |
| Figure before him. |  | 2 shows the user having created a number of items on the screen |

```
A small, white
feedback for pointing. The
```

```
in this example command; the
some color from the pre-
The same is true
```

|  | item is placed. | The |
|---|---|---|
| a "when"; | that is, | it |
| of the | "there" | is |

```
to a Create routine, which
Before the user recites
The awaited parameter is input,
input from the wrist-borne
```

```
"Move . ."
The user can readily move items about the screen,
variety of ways in which to express the complete
Consider the user command:
"Move the blue triangle to the right of the green square."
This example conunand relies on voice mode only.
exist only one triangle on the screen at the time the command
adjective "blue" bears no information,
applies for the qualifier green in "green square."
We note in passing that in the phrase
"green" as voiced is treated simply as part of the name of the item as
originally created. That is, the color name
```

```text
in Moscow's "Red Square," where "Red"
Apropos of color, a more ambitious
the utterance "green" to pixel values,
```

```
The partitioning of the CIE color space on the basis of an ensemble of color
names could be programmer determined
might involve a quite sophisticated
subject observers name or classify displayed
that the mapping from attribute-name
even though it may be as complex as one cares to attempt.
In any event, the result of the above command
"hearing" its name, de-saturates as immediate
```

| "addressed," | disappears to the right of the green square. | from its present |
|---|---|---|
| The exact positioning | some reasonable placement | "to the right" is executed. |
| of relational | expressions | in graphic |

```
and has available a
"move" command.
```

| Should, | for example, is given, | there the |
|---|---|---|
| and could be omitted; | the same logic |  |

```
" . the green square," the attribute
is used in a nominal sense, as
is functionally part of a proper name,
```

```
"interpretive"
the matching mediated
into a number of referenceable
on an ad hoc basis,
calibration
colors.
to item-attribute
```

```
approach might be to map
through the
regions.
or the partitioning
on the basis of having
The essential point is
can be well defined,
```

```
is that the blue triangle upon
feedback that it has been
site to re-appear centered in a spot
```

```
is programmer determined in our version;
The meaning, intent and interpretation
space is a complex issue [5,6]; the
```

-----

![](img_p6_1.png)

```
Figure 2
Talking and pointing to items on the Media Room's large screen . Here, the
items are circle and diamond shapes being moved about against a backdrop of
a Caribbean map. A double exposure effect catches two images of the user's
right arm, strapped to which is the smaller of the pair of space-sensing
cubes (covered by the user's cuff). On a pedestal to the right of the user
chair is a lucite block, and to the top of this block is attached the
larger transmitter cube.
```

-----

```
important thing is that the item is now where the user has ordered it to be,
and he can make minor modifications
Now, in our example action, the user might equally well have said:
"Move that to the right of the green square."
In this option, the user employs the pronoun
to what is intended, the pointing act being a motor analogue to the speech
string: ". . the blue triangle
Notice that in this mode of giving the command,
```

| the words "blue" and "triangle," what it is called. subtle and interesting "That" is thus defined as |  | In our simple graphics world, sense, where it is. whatever is pointed out; |
|---|---|---|
| "ostensively defined" | [7]. unlike that of telling a small child what things | For the namer, |
| pointing at a cat, | and saying | given by indicating what is the intended referent in the context of |
| alternatives, | namely, | whatever else is in the scene. |

```
This process of "pronomialization"
graphical example. The intended target spot to which the item is to be
moved can be rendered as
"Put that there"
where there, now indicated by gesture,
". . . to the right of the green square."
more general. The place description
presupposes an item in the vicinity for reference:
There may be no plausible reference
a word description of where the moved item is to go.
```

| however, | may readily be indicated | by voice-and-pointing: |
|---|---|---|
| function, | as well as others, | some variation in expression is understandably |
| a valuable option; | thus, | a mini-thesaurus |

| "put," | "place," | etc., | is built into the vocabulary. |
|---|---|---|---|
| "Copy |  |  | . . ." as a command is simply a variant of the move action, the image of the item to be moved also remains in place at the original |

```
in position later.
"that," simultaneously pointing
. "
the user may not only omit
he need not even know what the thing is, or
what anything i_s, is-~n a
```

```
effectively, it is
at least, the process is not
"are": for example,
"cat" or "kitty." The meaning of the word is
```

```
can readily be extended in our simple
serves in lieu of the entire phrase
The power of this function is even
". . . to the right of the green square"
namely, the green square.
frame in terms of already extant items for
The intended spot,
there. In this
of common synonyms, such as "move,"
except that
spot.
```

```
"Make that . . ."
The attributes of any item in this graphic mini-universe that the user has
called into existence by voice and gesture can be modified. Here, the
attributes are those of color and size.
For example, the utterance:
"Make the blue triangle smaller"
causes the referenced item to become reduced in size. The mode of reference
in this instance is via voice alone, but the user could as well have said,
pointing to the desired item:
"Make that smaller . . ."
The command:
"Make that a large blue diamond"
uttered while the user points at a small yellow circle causes the indicated
transformation.
```

| Extrapolations | readily suggest themselves, | e.g., | the command line: |
|---|---|---|---|
| "Make that item). | (indicating some item) | like that | (indicating some other |

-----

```
The second "that" is, functionally, a when to read the x,y coordinate of
pointing. The item indicated when the second "that" is uttered becomes the
"model" for change, and internally, the action is an expunging of the first
referenced item, to be replaced in a "copy"-like fashion by the second
referenced item.
```

| "Delete . . ." |  |  |  |  |
|---|---|---|---|---|
| The "delete" command | (synonyms: allows the user to drop selected items from display. | "erase; expunge; | take out. | ," etc.) |
| As before, | the "operand" of the command can be: |  |  |  |

```
". . . the large blue circle"
```

```
or
". .that" (pointing to some item).
Again, variations and extrapolations of the basic notion suggest themselves:
global expunging, "clear" or "delete everything," in order to wipe the graphical
slate clean; or "Detete everything to the left of this (drawing a line
vertically down the face of the screen)."
```

```
NAMING
Consider a blue square that is present upon the screen. The user points to
it, saying:
"Call that . the calendar"
with the intention of later somehow elaborating the blue square at that node
```

| into a graphical "appointment book." |  |  |
|---|---|---|
| The initial portion of this utterance, the recognizer unit results in codes being sent over to the host system | "Call that | . . .," when processed by |
| signalling that a "naming" command has been issued. what item is singled out by pointing are noted by the host system. |  | The x,y coordinates of |

```
The host system then immediately directs the speech recognition unit to
```

| switch from "recognition mode" to "training mode" |  | so that the recognizer |
|---|---|---|
| will add the latter part of the utterance, entry in its file of word reference patterns. | " | . . the calendar," as a new Upon completion of this |
| action, ready for the next verbal input. | the recognizer is directed to go back into recognition mode, | to be |

```
As the communications for switching the recognizer under host-system control
between recognition and training modes currently takes a finite amount of
```

| real-time, | a brief pause | (indicated in the command above by three dots) must occur in the spoken command line to accommodate the time taken for the mode |
|---|---|---|
| shift. | However, | the user tends to pause at precisely that point in the command line anyway, waiting for momentary desaturation of the blue square. |

```python
This quick desaturation of an addressed item was noted earlier in this
paper as being the system's way of giving visual feedback that the user has
indeed "contacted" the item.
This spontaneous pause for feedback fortunately operates in this context to
"mask" for the user the system's need for a pause in input. However, the
obligation to pause represents to the system designer something of a break-
down in the general convenience of continuous vs discrete speech input. An
eventual strategy for relieving the necessity f--or a user pause in speech is
the augmentation of the "intelligence" resident in a speech recognizer unit
so that it to some extent interprets as well as recognizes.
For example, upon the recognition of certain "key" words or phrases within
the input utterance, the recognizer itself switches directly from recognition
to training mode so that sub-portions of the input utterance are handled
appropriately.
```

-----

| In the case of the "Call that | . . ." or naming command, | the action of the now |
|---|---|---|
| "intelligent" | recognizer would be in effect to truncate-off | from the "front- |
| end" of the original successive recognized words of the command, | input speech signal that span of signal corresponding | to the non-recognized residue of the |

```
speech line to be then assumed as the new name to be assimilated by the
recognizer to its internal reference pattern lexicon. In order to maintain
overall coordination with the host system, the recognizer would of course
simultaneously transmit ASCII codes for recognized or learned words, together
with any relevant "control" codes.
While such a strategy may eliminate the need for a within-sentence speaker
pause, the general problem of "coarticulation" remains: the phonemic properties
of the speech signal for any word are influenced by what words are spoken
with it, what particular words precede or follow the word in question
(Cf. reference 3, p. 518). Thus, while not required to pause, the speaker
yet must enunciate very clearly, particularly when about to utter the new
name to be added.
```

```
SUMMARY
```

| The foregoing rudimentary set of commands, | concerning | themselves with the |
|---|---|---|
| simple management of a limited ensemble of non-representative intended to suggest the versatility and ease of use that can enter upon the | objects, | is |
| management of graphic space with voice and gesture. |  | More real-life examples |

| of commanding about | "things" battalion formations about as overlays on a terrain map; | in a more meaningful moving ships about a harbor map in planning a harbor facility; where rooms and hallways as rectangles are tried out "here" and "there." | space come readily to mind: moving facilities planning, |
|---|---|---|---|

```
The power of the described technique is that indications of what is to be
```

and naturally in ways which are compatible with the spirit and nature of the

|  | done with these visible, out-there-on-view | items can be expressed spontaneously |  |
|---|---|---|---|
| display: typed symbols. | one is pointing to them, | addressing them in spoken words, | not |
| Further, | the pronoun as verbal tag | achieves | in the graphical world the same |
| high | usefulness presence of a pointed to, visible graphic | it has in ordinary discourse by being pronounced which functionally defines its | in the |

```
meaning.
```

```
ACKNOWLEDGEMENTS
The programming and systems expertise of Chris Schmandt and Eric Hulteen
underlay the implementation and development of the concepts described in
this paper. Their efforts are duly appreciated.
```

```
i.
2.
3.
4.
```

```
5.
6.
7.
```

```
REFERENCES
```

| Negroponte, Machine Group, | N | The Media Room. Cambridge, |
|---|---|---|
| Bolt, Machine Group, | R.A. | Spatial Data-Management.. Cambridge, |
| Reddy, | D.R. | Speech recognition by machine: |
| the IEEE, | 64, | 4 (April 1976), |
| Rohinson, | A.L. | More people are talking to computers as speech recognition enters the real world. |
| Science, | 203, | (16 February 1979), |
| Sondeheimer, | N.K. | Spatial reference and natural-language machine control. International Journal of Man-Machine |
| Winston, | P. | Learning structural descriptions |
| MAC, | TR-76, | 1970. |
| Olson, semantics. | D.R. | Language and thought: Psychological |

```
Report for ONR and DARPA. MIT, Architecture
MA, December 1978.
DARPA Report. MIT, Architecture
MA, March 1979.
a review. Proceeding of
501-531.
```

```
(Research News) (First of two articles)
634-638.
```

| Studies, | 8, from examples. | (1976), | 329-336. MIT Project |
|---|---|---|---|

```
Aspects of a cognitive theory of
Review, 77, (1970), 257-273.
```