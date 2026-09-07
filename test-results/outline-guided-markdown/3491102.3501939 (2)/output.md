# Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization

Making Data Tangible: A Cross-disciplinary

Data Physicalization

S. Sandra Bae Clement Zheng

sandra.bae@colorado.edu clement.zheng@nus.edu.sg ATLAS Institute Industrial Design University of Colorado National University of Singapore Boulder, CO, USA Singapore

Design Space for

Mary Etta West

mary.west@colorado.edu Computer Science University of Colorado Boulder, CO, USA

Ellen Yi-Luen Do

ellen.do@colorado.edu ATLAS Institute University of Colorado Boulder, CO, USA

Samuel Huron

samuel.huron@telecom-paristech.fr Department SES - Télécom Paris Institut Polytechnique de Paris, CNRS I3 Palaiseau, France

## Abstract

Designing a data physicalization requires a myriad of diferent considerations. Despite the cross-disciplinary nature of these considerations, research currently lacks a synthesis across the diferent communities data physicalization sits upon, including their approaches, theories, and even terminologies. To bridge these communities synergistically, we present a design space that describes and analyzes physicalizations according to three facets: context (end-user considerations), structure (the physical structure of the artifact), and interactions (interactions with both the artifact and data). We construct this design space through a systematic review of 47 physicalizations and analyze the interrelationships of key factors when designing a physicalization. This design space crosspollinates knowledge from relevant HCI communities, providing a cohesive overview of what designers should consider when creating a data physicalization while suggesting new design possibilities. We analyze the design decisions present in current physicalizations, discuss emerging trends, and identify underlying open challenges.

CCS CONCEPTS

- Human-centered computing → Visualization theory, con-

**cepts and paradigms.**

KEYWORDS

data physicalization, design space, data visualization, tangible user interface, design

---

This work is licensed under a Creative Commons Attribution International 4.0 License. *CHI'22, April 29-May 5, 2022, New Orleans, LA, USA* © 2022 Copyright held by the owner/author(s). Publication rights licensed to ACM. ACM ISBN 978-1-4503-9157-3/22/04. https://doi.org/10.1145/3491102.3501939

Danielle Albers Szafr

danielle.szafr@colorado.edu ATLAS Institute University of Colorado Boulder, CO, USA & Dept. of Computer Science University of North Carolina Chapel Hill, NC, USA

ACM Reference Format:

S. Sandra Bae, Clement Zheng, Mary Etta West, Ellen Yi-Luen Do, Samuel Huron, and Danielle Albers Szafr. 2022. Making Data Tangible: A Crossdisciplinary Design Space for Data Physicalization. In CHI Conference on *Human Factors in Computing Systems (CHI '22), April 29-May 5, 2022, New* *Orleans, LA, USA. ACM, New York, NY, USA, 18 pages. https://doi.org/10.* 1145/3491102.3501939

## 1 Introduction

Data physicalization-the practice of mapping data to physical form-sits at the crossroads of various domains, including data visualization, tangible user interaction (TUI), and design1 . Visualization researchers formally defne physicalization as "how computersupported, physical representations of data (i.e., physicalizations) can support cognition, communication, learning, problem solving, and decision making" [40]. While physicalization is a nascent research subdiscipline, the fundamental ideas behind physicalization have a rich history that goes beyond visualization research. Examples of physicalizations have existed for centuries (e.g., Sumerian clay tokens [44], Ammaslik wooden maps [17], Marshall Islands stick charts [18]) and are also integrated into crafting practices (e.g., steganography [53], computational textiles [54]). As a result of this extensive and diverse history, data physicalization artifacts are diverse in structure, features, and interactions, appearing in many diferent contexts. Crafting physicalizations requires design considerations beyond conventional visualization approaches. While all visualizations must consider the expressivity of their designs (e.g., data encoding and data interactions), data physicalizations must also be mindful of structural considerations (e.g., structural stability, material choice) and the context where the physicalization exists (e.g., audience, location). The diversity and interplay of these requirements can 1We specifcally refer to the "design community" as the Design-oriented venues in CHI where researchers focus on broadening interaction design while promoting new aesthetic and sociocultural possibilities (i.e., the DIS conference and the CHI Design subcommittee). We acknowledge that researchers within the broader CHI community are all designers to some degree, but we use the distinction of the "design community" to emphasize the values that this specifc group holds within HCI.

make physically representing data difcult. Data physicalization designers currently face an additional burden of having to navigate diferent relevant intellectual communities' set of approaches, theories, and terminologies without a cohesive lens. As a result, designers may be unaware of the knowledge and best practices emerging in other communities such as data visualization (i.e., how to efectively encode data), TUI (i.e., how to amplify the capabilities of the human body and physical world for interaction design), or design (i.e., how to identify and leverage a material's potential). However, bridging diverse knowledge and practice requires understanding each community's values, biases, and sets of assumptions. To holistically understand the depth and breadth of the design dimensions data physicalization provides, this paper examines physicalizations from the perspective of researchers from the data visualization, TUI, and design communities.

While previous research has cataloged physicalization artifacts based on semiotics [77, 106, 120], fabrication techniques [15], and visualization tasks [19], past work often focuses on a single perspective of data physicalization rather than refecting on the broader intellectual foundations of the communities in HCI that data physicalization sits upon. We instead aim to synthesize knowledge from across these communities to develop a theoretical design space that highlights cross-disciplinary considerations for creating physicalizations. While design spaces can be characterized by their (1) descriptive power, "to describe a signifcant range of existing interfaces"; (2) evaluative power, "to help assess multiple design alternatives", and (3) generative power, "to help designers create new designs" [5], this design space is more descriptive by nature to focus on the aforementioned aim. We develop this design space by examining key components of physicalization design and development: who, what, where, and how. Who are the intended audiences (e.g., the public, scientists, analysts)? Where are physicalizations used or showcased? What design decisions contribute to a physicalization's materiality (i.e., presence in the world)? What interactions does a physicalization aford? How do diferent communities approach physicalization? (And what can we learn from each other?) These questions help elucidate and describe specifc factors of physicalization design and their interrelationships to highlight the emerging patterns in physicalization research.

We developed our design space by surveying physicalization research in two popular databases encompassing relevant communities: the ACM Digital Library (DL) and IEEE Xplore. Our survey aims to capture the rapidly emerging practices of physicalization research since Jansen et al.'s formalization of the feld in 2015 [40]. We look at work that has been published after this date to examine advances since their initial theoretical efort and limit our scope to recent advances. Our survey used a grounded theory-inspired approach to analyze various interdisciplinary design considerations in 47 physicalizations from 18 diferent venues. We surveyed these physicalizations according to three facets of design-context (the end-user considerations), structure (the physical structure of the object), and interactions (interactions with both the artifact and data)-deriving thirteen dimensions of physicalization design, illustrated in Figure 1. We developed our codes by drawing on the diverse experience of the authors to help characterize and identify key considerations and open challenges in design, computation, interaction, and materiality [76, 105, 108, 114]. Our design space bridges the knowledge from each community: it provides a cohesive overview of what designers should consider when creating a data physicalization and summarizes relevant trade-ofs. We close by highlighting promising opportunities for diferent communities to learn from each other and ofering guidance for future work in the feld.

## 2 Background & Related Work

To create a design space for physicalization, we draw on existing defnitions of the feld and explore past characterizations of physicalization from visualization, TUI, and design.

### 2.1 What is Data Physicalization?

The defnition and practice of data physicalization are constantly evolving. Jansen et al. [40] originally defned physicalization as "a physical artifact whose geometry or material properties encode data" [40]. This defnition implies that only the physical properties of the artifact encode data. However, Hogan and Hornecker [32] extend this defnition by arguing that data in physicalizations can be "encoded in the shape as well as the behavior of the representation." Using a physicalization made from spin tops as an example, Hogan and Hornecker contend that our interpretation of the data embedded in the spin tops cannot be fully interpreted until the spin top is set in motion. This example illustrates that our understanding of physicalization must go beyond the physical form and encompass a holistic view that considers the object's materiality (i.e., the quality of presence in the world [28, 113]), a well-studied concept in design research but less common in visualization. Ofenhuber [76], in contrast, contends our understanding of data physicalization should be based on broadening our traditional notion of data (i.e., external data sets) rather than simply focusing on the physical artifact. By employing epistemological and ontological perspectives, Ofenhuber illustrates how many physicalization examples are not based on external datasets and highlights our implicit and explicit assumptions about data, especially what we consider data to be. These perspectives illustrate how the defnition and values behind data physicalization are still in fux. We, however, do not attempt to defne data physicalization. Instead, we acknowledge that the defnition of physicalization varies among and even within the communities. This variance necessitates cross-disciplinary synthesis to scafold collaboration and innovation.

Physicalization designers may view and implement physicalizations according to the practices and values of their native intellectual community. As one example, Friske et al. from the design community refect on how during the process of creating their physicalization "[d]ata became one material among others, no more or less important in design" [25]. With this perspective, Friske et al. discussed how they had to negotiate between how accurately they wanted to encode the data in the physical representation versus embracing the spirit of the material (i.e., yarn). This perspective stands in contrast to the visualization community's more cognitively-oriented perspective where data encoding is typically prioritized in terms of its efectiveness in helping users carry out their analytical tasks, such as comparing values or estimating correlation [10, 68]. Jansen et al. [40] outlined the need to understand the efectiveness of physical variables (e.g., how do people perceive

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA

CONTEXT INTERACTIONS STRUCTURE

| Year | Ref. | Title | Authors | Venue |
|---|---|---|---|---|
| 2015 | [12] | The Role of Tangible Interaction | Claes et al. | PerDIS |
| 2015 | [70] | LineFORM: Actuated Curve Inter- | Nakagaki et al. | UIST |
| 2015 | [73] | Data-Things:Digital Fabrication | Nissen et al. | CHI |
| 2016 | [34] | Physikit: Data Engagement Through | Houben et al. | CHI |
| 2016 | [51] | Fantibles:Capturing Cricket Fan's | Khot et al. | DIS |
| 2016 | [59] | Skintillates: Designing and Creating | Lo et al. | DIS |
| 2016 | [84] | Watt-I-See: A Tangible Visualization | Quintal et al. | AVI |
| 2016 | [101] | Investigating the Use of a Dynamic | Taher et al. | VIS |
| 2017 | [6] | "It's like holding a human heart": | Boem et al. | Springer |
| 2017 | [23] | PolySurface: A Design Approach for | Everitt et al. | DIS |
| 2017 | [27] | Cairn: A Tangible Apparatus for Sit- | Gourlet et al. | DIS |
| 2017 | [50] | EdiPulse:Investigating a Playful | Khot et al. | CHI |
| 2017 | [82] | Torrent: Integrating Embodiment, | Pon et al. | TEI |
| 2017 | [99] | FluxMarker:Enhancing Tactile Graph- | Suzuki et al. | ASSETS |
| 2017 | [110] | Exploring Spatial Meaning with a | Walker et al. | PerDIS |
| 2018 | [3] | Making data matter: Voxel printing for | Bader et al. | Sci.Adv. |
| 2018 | [35] | Tensions of Data-Driven Reflection: | Howell et al. | CHI |
| 2018 | [98] | Reactile:Programming Swarm User | Suzuki et al. | CHI |
| 2018 | [103] | Self-Reflection and Personal Physi- | Thudt et al. | CHI |
| 2019 | [13] | CairnFORM: A Shape-Changing Ring | Daniel et al. | TEI |
| 2019 | [14] | ListeningCups:A Case of Data | Desjardins | DIS |
| 2019 | [29] | RoboGraphics: Dynamic Tactile | Guinness et al. | ASSETS |
| 2019 | [45] | Bookly:An Interactive Everyday Arti- | Ju et al. | CHI |
| 2019 | [56] | Dynamic composite data physicaliza- | Le Goc et al. | VIS |
| 2019 | [69] | Encoding Materials and Data for | Nachtigall et al. | CHI |
| 2019 | [109] | Data Manifestation:Merging the | von Ompteda | VISAP |
| 2019 | [100] | ShapeBots: Shape-Changing Swarm | Suzuki et al. | UIST |
| 2020 | [2] | PiHearts:Resonating Experiences | Aslan et al. | ICMI |
| 2020 | [26] | Opening the Black Box:Investigating | Chakarov et al. | ICER |
| 2020 | [25] | Entangling the Roles of Maker and | Friske et al. | DIS |
| 2020 | [57] | DayClo: An Everyday Table Clock | Lee et al. | DIS |
| 2020 | [67] | Venous Materials:Towards Interac- | Mor et al. | CHI |
| 2020 | [71] | TRANS-DOCK:Expanding the Inter- | Nakagaki et al. | TEI |
| 2020 | [80] | Motiis:Fostering Parents'Awareness | Pepping et al. | NordicCHI |
| 2020 | [81] | Chemicals in the Creek: designing a | Perovich et al. | VIS |
| 2020 | [86] | Slice and Dice: A Physicalization | Raidou et al. | Pac.Graph. |
| 2020 | [91] | LOOP: Exploring Physicalization of | Sauvé et al. | NordicCHI |
| 2020 | [90] | Econundrum: Visualizing the Climate | Sauvé et al. | DIS |
| 2020 | [102] | AirTouch:3D-Printed Touch-Sensitive | Tejada et al. | CHI |
| 2020 | [107] | CoDa:Collaborative Data Interpreta- | Veldhuis et al. | TEI |
| 2020 | [116] | Subtletee: Augmenting Posture | Woźniak et al. | ACM HCI Jo. |
| 2020 | [121] | Tangible Interfaces with Printed | Zheng et al. | DIS |
| 2021 | [22] | Documented:Embedding Information | Ettehadi et al. | CHI |
| 2021 | [58] | ADIO: An Interactive Artifact Physi- | Lee et al. | CHI |
| 2021 | [65] | Laina: Dynamic Data Physicalization | Menheere et al. | DIS |
| 2021 | [87] | Plant-Human Embodied Biofeedback | Sabinson et al. | TEI |
| 2021 | [117] | Making Sense of Complex Running | Woźniak et al. | CHI |

~~18 15 3 2 2~~ 1 ~~8 21 6 4 2 2~~ 1 ~~4 8 10 8 5 5 3 2 14 11 10 10 8 7 3~~ 1 ~~45 33 4~~ 1 ~~31 20 13 4 12 11 9 8 5 5 4~~ 2 3 ~~2 9 4 3 5 3 2~~ 1 1 ~~9 6 4 23 17 15 12 7 5 2 35 12 36 39 11 8 25 12 10~~

**Figure 1: We surveyed physicalizations from across HCI to construct a design space spanning three facets-context (end-user considerations), structure (physical structure of the artifact), and interactions (interactions with both the artifact and data)-over 13 dimensions. While dimensions primarily reside in one facet, each design dimension is not siloed to just one facet but rather can influence other facets: the design dimensions are interrelated. See Section 3.2 for more details. The bar on the outer frames shows the distribution of the design dimension within our surveyed corpus. The length of each bar is determined by how many times the design dimension has been used.**

sizes in a physicalization [41]) as part of physicalization's research agenda. Ofenhuber [76] cautions that framing physicalization as another traditional visualization application may be a "lost opportunity" that unnecessarily restricts the conceptual and aesthetic implications of physicalization. We reference these perspectives throughout the paper in the context of trends in physicalization research to understand how diferent communities approach data.

Our goal is to create a cohesive, cross-disciplinary survey focused on the design practices and decisions that researchers engage with when creating physicalizations. This survey considers an artifact as a physicalization if Jansen et al.'s or Hogan and Hornecker's defnitions are satisfed. Jansen et al.'s defnition encompasses many of the accepted defnitions in current research (see Section 3.2 for our inclusion criteria); however, we augment this defnition with Hogan and Hornecker's inclusion (i.e., data can also be encoded through the behavior of the artifact) to increase the diversity of sampled artifacts, including soft wearables [25, 35], fuidic displays [67, 82, 84], shape-changing displays [6, 23, 71, 101], and vibrotactile haptic displays [2, 80, 116] (Figure 5). The resulting corpus provides an opportunity to refect on diferent theoretical and design perspectives across disciplines.

Records identified through Records identified through ACM DL database IEEE Xplore database (n = 520) (n =107)

---

Records after duplicates removed, non-archival papers Records excluded

(i.e., posters, extended abstracts,workshops) (n = 216)

(n = 411)

---

Papers assessed Records excluded for eligibility\* (n = 364) (n = 411)

Papers categorized as eligible Paper included from

using inclusion criteria expert augmentation

(n = 42) (n = 5)

**Figure 2: PRISMA flow diagram [78] on how the final corpus was curated (n = 47). See Section 3.1 for our inclusion criteria.**

### 2.2 Physicalization Theory

To develop broad, cross-disciplinary knowledge, we draw on existing theoretical investigations of physicalization. For example, Dragicevic et al. [19] outline historical and recent physicalizations organized by Brehmer's and Munzner's typology of abstract tasks [8]: to discover, to present, and to enjoy. This survey highlights examples of physicalizations that illustrate each task but does not consider other attributes of physicalizations that afect their use and comprehension, such as materiality. However, this task-centric perspective primarily refects the core values of the visualization research community (i.e., designing systems that help people gain specifc information from data [94]). Further, Dragecevic et al.'s survey focuses more on providing a landscape of artifacts as opposed to a systematic analysis of design factors such as material and location.

Other eforts catalog and describe physicalization by focusing on specifc design capabilities and epistemological perspectives, such as indexicality [77, 120], autographical interactions between data and representation [75], embeddedness [115], situatedness [9], and multi-sensory capabilities [32]. These works illuminate the importance of a single critical aspect of physicalization design rather than refecting on the broad intellectual foundations of the feld. More practice-based investigations have explored the interdisciplinary interchange between visualization and design-based felds. For example, Hull and Willett [36] explore how architectural methods can inform how designers can best engage an audience, encode data into physical form, and determine what kind of workfows can best support data physicalization. Hull and Willet's work highlights the promise of bridging cross-disciplinary methods to beneft physicalization.

While past work illustrates the promise of physicalization from a range of perspectives, we lack design frameworks that accurately and holistically characterize this emerging research space. We take inspiration from Hull and Willet's work to bridge communities in a way that produces synergistic knowledge of the range of factors people consider in physicalization development, the interrelations of these factors, and key trade-ofs. We build on prior theoretical eforts to formulate our preliminary set of codes (see Section 3.2) and expand on these ideas to illustrate how the knowledge from data visualization, TUI, and design can enrich our understanding of data physicalizations. We focus our survey on HCI research papers and exclude practice-based physicalizations from art and commercial tools. This focus allows us to maintain a manageable scope and minimize assumptions about intention, context, and design deliberations and trade-ofs by using concrete, explicit evidence from the papers (e.g., descriptions, implementation details, design specifcations) to analyze the author(s)' intentions. In contrast, artistic and public installations often provide minimal descriptions of the intentions and aims behind the works, requiring us to infer design intention and specifcations and increasing the potential for errors in our coding process.

## 3 Survey Methodology

To construct a design space for data physicalizations, we conducted a systematic survey based on a keyword search to assemble a corpus of physicalizations and augmented our corpus with canonical examples. These examples draw from the diverse experience of the authors, who are experts in visualization, TUI, and design. The survey data was then classifed through an open coding approach to identify key design space dimensions. This review qualitatively analyzes work over a six-year period (2015-2021, *n* = 47; Figure 2) across visualization, TUI, and design. Two authors served as coders throughout the process, working in regular consultation with the rest of the research team.

A keyword-based approach (the keywords are explained in Section 3.1) provides two benefts: (i) it imparts a clear cut-of criterion for papers published under the theme and/or reference of data physicalization and (ii) it can lead to more comprehensive results by efciently sampling a larger range of possible papers. However, diferent communities may use diferent terminology, meaning that

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA keyword use may overlook niche terms of art. The result is also subject to the databases' primary research focus which can fail to encapsulate how communities beyond ACM and IEEE view data physicalization. To address these limitations, we supplement our keyword search with selected case studies drawn from the collective experience of the research team (fve total additional studies). This expert augmentation identifes canonical examples based on the authors' knowledge of the feld, providing critical depth to the design space beyond the initial search.

### 3.1 Dataset Creation

The broad list of communities in which data physicalization research is published prohibited a systematic review of specifc conference proceedings. Instead, we selected archival papers using keywords across ACM DL and IEEE Xplore-two of the most popular databases for data physicalization research that encompass a range of venues (ACM CHI, ACM UIST, ACM DIS, IEEE VIS, etc.). The resulting corpus is available in the supplemental materials2 .

Our theoretical framework is based on a corpus of 47 physicalizations selected using the following inclusion criteria: **Date: Though examples of physicalizations date prior to** 2015, Jansen et al. coined the term "data physicalization" and formalized the feld within visualization in 2015. We look at work that has been published after this date to examine advances since their initial theoretical efort and to limit the scope to recent advances.

**Keyword Match: We considered papers where the authors used**

one of the following terms in the title, abstract, text, or author keywords: data physi- (e.g., data physicalization, physicalisation,

```
data physicality), data materiality, tangible- (e.g., tangible
data, tangible visualization, tangible visualisation), and
physical- (e.g., physicalization, physical visualization).
```

We chose these terms due to their close relationship to data physicalization (e.g., physical visualization is a synonym for data physicalization [39]) and their use in prior literature.

**Eligibility: Our initial search retrieved 627 candidate papers: 520**

papers from ACM DL and 107 papers from IEEE Xplore. We then screened the candidate papers to remove duplicates3 and nonarchival papers (i.e., posters, extended abstracts, magazine articles, workshop papers). After screening, 411 papers remained. We then removed any papers that prohibited conclusive coding using the following criteria: (1) The paper introduced a new technique, briefy using one of the keywords but not explaining how the application or design of the technique can be applied to physicalization (e.g., [7, 88]). (2) The artifact created in the paper did not provide data insights but was predominantly used as an interface control (e.g., [43, 46, 63]). See the discussion of "Data Physicalization and TUI" in Jansen et al. [40] for further discussion.

2See https://sandrabae.github.io/dataphys-gallery/ 3When we encountered the same work by the same authors, we used the latest published work (e.g., Le Goc et al., 2018 [56]) and discarded the earlier versions from the corpus (e.g., Le Goc et al., 2016 [55]).

(3) The paper presented an experiment focused on outlining empirical guidelines (e.g., [42, 61, 97]). We prioritized papers that demonstrated a design process through the artifact produced in the paper. (4) Data was encoded through sonifcation or olfaction rather than through the physical properties of an object (e.g.,[4, 72]). Sonifcation [47, 62] and olfaction [64] are considered their own areas of research and outside of our current scope. (5) Papers that presented multiple artifacts [49, 60], but the individual artifacts presented ambiguous codes. To reduce ambiguity, we prioritized papers that allowed insight into the overall design methodology used to develop an artifact. Using these inclusion criteria, two research team members each examined half of the corpus to remove any papers that did not meet the criteria or needed further discussion. Papers needing discussion were reviewed by the full research team. After deriving the fnal dataset, we added fve additional examples[3, 6, 69, 86, 109] based on recommendations from the team, who refect expertise in visualization, TUI, and design, to capture relevant examples not included in the original corpus.

### 3.2 Codebook

We coded each example in our corpus using a grounded theoryinspired approach. Our codebook consisted of terms and categories that examined the three key facets of physicalization design and development (context, structure, and interaction), focusing on fve questions: Who are the intended audiences? Where are physicalizations used or showcased? What design decisions contribute to a physicalization's materiality? What interactions does a physicalization aford? How do diferent communities approach physicalization? (And what can we learn from each other?) We generated terms and categories that described the variation within our corpus guided by these questions and past theory from relevant communities (e.g., using interaction models from data visualization [119] and design [108]), adding terms as we observed new design variations that did not ft our initial codes. These codes are intended to reveal the interrelationships between key factors of data physicalization by drawing upon existing theories from the relevant communities. We limited our codes to attributes of the physicalization that could be assessed through the paper's images and supporting text. This constraint precluded analysis where we would have to make assumptions about the authors' intention or approach. The fnal codebook is summarized in Table 1 and full code defnitions can be found in the supplemental materials.

We summarize the 13 dimensions of our design space by whether they pertain to a physicalization's context (i.e., aspects of the design environment such as users, data, or location), its structure (i.e., its physical form), and its interactions (i.e., how it afords and responds to user inputs). *3.2.1 Context. Context describes the physical, social, and analyti-* cal frames a physicalization addresses [11]. Context grounds the visual design and functionality behind a data physicalization, including the attributes describing the intended goals, environment, and users of the physicalization. We use the concept of situated *visualization-embedding data into its context of use-from the vi-* sualization community as a lens to see how physicalizations make

**Table 1: The final codebook with 13 design dimensions and 74 subcodes. Dimensions were further categorized into those describing the context, structure, and interactions of a physicalization. Multiple refers to situations where multiple codes may describe a single dimension according to the paper's images and supporting text. Full code definitions can be found in the supplemental materials.**

---

Context

| Design Dimension | Code | Multiple |
|---|---|---|
| Task | Analyze, Educate, Express, Refect, Enjoy, Collaborate, Unspecifed | Yes |
| Audience | General Public, Children, Family, Researchers, People with Disability, Creator, Other, Unspecifed | Yes |
| Location | Home, Workspace, Public Space, Body, Outdoors, School, Unspecifed | No |
| Data source | Biological and Medical, General Statistics, Personal, Fitness & Wellness, Geographical, Environmental, Image/Video | Yes |

---

Structure

Embodiment Shape-Changing Display, Swarm Robotics, Fluidic Displays, Voxel No

Prints, Light Display, Embedded Tags, Edibilization, TUI, Environmentally-Embedded, Personally-Embedded, Activity-Embedded

| Material | Non-Electronic, Electronic | No |
|---|---|---|
| Encoding Channel | Color, Form, Position, Volume, Texture, Light, Vibrotactile | Yes |
| Mobility | Unbounded, Bounded | No |
| Data Scalability | One, Many | No |
| Data Duration | Ephemeral, Persistent, Permanent, | No |

Interactions

| Interactions Mediator | GUI, Direct, Sensed, N/A | Yes |
|---|---|---|
| Sense Modality | Visual, Tactile, Aural, Taste | Yes |
| Data Interactions | Select, Explore, Reconfgure, Encode, Abstract/Explore, Filter, Connect, | Yes |

Annotate, Collect, Assemble

---

use of context. Context also examines the end-user considerations guiding design, including its intended tasks (what is the functional purpose of the physicalization), audience (who is the physicalization intended for), location (where does the physicalization exist), and *data source (what kinds of data are represented).* *3.2.2 Structure. Structure focuses on how data is physically embod-* ied and encoded, including its overall form. We draw on theoretical perspectives from the TUI and design communities on embodiment and materiality to characterize structure. Categorizing physicalizations based on the physical structure is challenging, largely due to the diverse fabrication approaches that physicalization designers adopt [15]. We focus on how the data is embodied-how data is physically manifested 4 . The concept of embodiment and its benefts have been extensively discussed in the TUI community [33, 38, 118]. For example, Zhao & Vande Moere [120] who also recognize the importance of embodiment for physicalizations. To holistically understand embodiment in physicalization, we also examine the physicalization's use of materials, such as 3D printing flament, yarn, motors, and liquids. Materials are the building blocks of physicalizations, shaping a physicalization's physical structure, interactions, and materiality (i.e., presence in the world [28, 113]). To understand the relationship between materials and other dimensions of physicalization design, we coded examples of what materials the physicalization is composed of; how data is *encoded through the physicalization's tangible and visual proper-* ties; how mobile the physicalization is; whether the physicalization 4Our use of embodiment refers to providing a tangible or visible form to something abstract [79].This defnition is distinct from embodiment as considering human bodies and actions in tangible and social computing systems, as described by Dourish [16].

is scalable in handling multiple, distinct datasets; and how long the data is displayed for (i.e., data duration). Through these design dimensions, we can also gain a better understanding of the values designers place in the material. Gross et al. [28] state there are three distinct perspectives a designer can consider when using a material: physical, computational, or cultural. The physical framing focuses on how a material functions with its physical properties and how efectively a material can accomplish a task. The computational framing denotes that computers, digital information, and other intangible aspects of computational systems are also considered materials that are incorporated with physical things. The cultural aspect focuses on examining materials related to crafting practices and how materials "communicate" to the maker.

*3.2.3 Interactions. Interaction focuses on the dialogue between* the user and the physicalization. With physicalizations, a data in*teraction (e.g., fltering a dataset) can be examined by analyzing* how the interaction was executed at the artifact-level (i.e., what design feature in the artifact made it possible to execute the flter interaction?). We draw on the concepts of afordances, feedforward, and feedback [108] to examine how interactions in general (e.g., pressing a button) are possible at the artifact-level, and we use Yi et al.'s data interaction framework [119] to identify the diferent data interactions imposed on physicalizations.

We characterize interactions based on how the physicalization afords interactions and what actions are taken with the data. The *interactions mediator refers to how an individual's data interac-* tions are captured (e.g., through a direct action, use of GUI, sensed through a sensor). The sensing modality highlights which human

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA senses are used when receiving feedback. Data interactions examine how each interaction changes the data presented to the user. We use Yi et al.'s framework of data interactions [119] to help capture the user's intent while interacting with the physicalization. We added three additional interactions (annotate, collect, assemble) based on observations from our corpus that incorporate actions that are more natural in physical rather than digital systems. Annotating refers to adding supplemental information to the physicalization, collect*ing provides additional data to the physicalization, and assembling* focuses on piecing physicalizations together.

### 3.3 Coding Process & Agreement

Two coders independently coded the physicalizations using a preliminary set of design dimensions. They reconciled codes after the frst 12 papers to ensure common understanding and application and again after each new code was added. The inter-rater reliability of the preliminary codes using Krippendorf's alpha [52] was high (κ = 0.85; 95% agreement). The coders discussed any conficting codes with the rest of the research team to arrive at a consensus, with one set of fnal codes assigned to each physicalization.

## 4 Design Space

The corpus consists of a total of 47 papers. This corpus covers several conferences in HCI and Design, including CHI (14/47), DIS (10/47), TEI (5/47), UIST (2/47), ASSETS (2/47), NordicCHI (2/47), PerDIS (2/47), AVI (1/47), ICER (1/47), and ICMI (1/47). We also survey conferences from Visualization and Visual Analytics (4/47) 5 and journal articles (3/47) .6 From our coding process, we derived 13 design dimensions that describe critical decisions in physicalization, which we organized into three facets: context, structure, and interactions (Section 4.1 - Section 4.3). We use these three facets to discuss the fve questions we posed in Section 1: Who are the intended audiences? Where are physicalizations used or showcased? What design decisions contribute to a physicalization's materiality? What interactions does a physicalization afford? How do diferent communities approach physicalization? (And what can we learn from each other?). See Figure 1 and https: //sandrabae.github.io/dataphys-gallery/ to see how the 13 design dimensions are distributed throughout the corpus.

### 4.1 Context

**Tasks:** While the data visualization community typically designs for exploration [10, 68], we found refection-the act of increasing one's self-knowledge-to be the most popular task physicalizations support (18/47). Topics of refection varied with focuses including personal informatics (e.g., exercise [51, 91], reading habits [45], emotions [35]) and data about family (e.g., children's emotions [80]). People also used physicalizations as a way to make a personal connection to bigger communities, such as commemorating a local river food catastrophe [82], permit violations in a local river [81], and climate change [109].

5IEEE VIS (2/47), IEEE VISAP (1/47) 6The Proceedings of the ACM on Human Computer Interaction (HCI), Springer AI & Society, and Science Advances

The next most common task was analysis (15/47). In these cases, people used physicalizations to explore statistical datasets. Physicalizations were also used to educate (3/47), collaborate (2/47), express (2/47; i.e., using a physicalization to express their feelings or ideas), and enjoy (1/47). There were also a handful of instances(8/47) where the task was unspecifed. In these cases, physicalizations were introduced but their intended purpose and/or what users should gain from the artifact was not explicit.

**Audience. We found that the majority of physicalizations targeted**

the general public (21/47), focusing on incorporating data into everyday activities [6, 35, 45, 73] that required little visualization literacy. Beyond the general public, we found physicalizations designed with a specifc audience in mind, including creators (6/47) (i.e., the physicalization is meant for the person who created it), researchers (4/47), *children (2/47), people with disabilities (2/47), and family (1/47). We* found four instances of other (4/47) designed for musicians [82], golfers [116], sports fans [51], and college campus visitors [110]. Several papers (8/47) did not explicitly state the intended audience of the artifact. In these cases, the physicalizations were designed to showcase a novel technology where they did not further explain their intended audience. While many physicalizations are often created with one audience group in mind, Torrent [82] (Figure 6a) is an interactive system that augments concert fute music with live water sounds designed for both performers and their audience throughout a performance. Water surface turbulence encodes the futists' muscle tension, and the physicalization is situated between the performer and audience to provide information throughout the performance.

**Location. Physicalizations in the corpus were designed for a range**

of locations, such as workspaces, homes, public spaces, outdoors, and even on the body. Many of the physicalizations were meant for a private location, including homes (10/47), the body (5/47), and *workspaces (8/47). About a quarter of the papers focused within a* *public space (8/47), such as schools [26, 107], golf ranges [116], and* event venues [13, 82]. Two physicalizations specifcally focused on *natural environments (ocean [109] and river [81]). Approximately* a third of the papers in the corpus (14/47) provided little to no information about the physicalization's intended location. As with the physicalization's audience, papers with an unspecifed location often used physicalization as part of an illustrative example for a new technique.

Physicalizations most commonly resided in homes (10/47). These physicalizations focused on capturing data from the house (e.g., environmental data [34], children's emotions during gaming [80]) or mimicking everyday objects, such as clocks [57], lamps [45], mementos [51], and design pieces [58, 65, 91]. Physicalizations for the home were designed to seamlessly integrate into the home environment. Everyday objects designed and situated for private environments, such as the home, encouraged more private and personally meaningful refections [45, 80, 91]. Laina [65], for example, is a 2.5D shape-changing display designed as an art piece that represented the user's running route data. Laina's slow-motion design features allowed the users to refect on their running path and feel a sense of pride in their accomplishments. Similarly, people who used Bookly [45] mentioned that Bookly's design, which encouraged readers to place and pick up the book at the base of the lamp opened

to their current progress, prompted them to read more and be more refective about their reading habit.

**Data Source. Compared to traditional visualization [89], few physi-**

calizations focused on traditional static, tabular data (11/47). Target tabular datasets included the U.S. population [100], world GDP [71, 101], civic data [12], conference metadata [102], student's grades [56], and sports matches [51]. Several physicalizations supported biomedical and medical data (8/47), primarily using biosensing data, such as galvanic-skin response [35], gait [69], heart rate [6, 50, 59], respiration rate [87], and muscle tension [82]. Fit*ness and wellness datasets (7/47) also included bio-sensing data, but* overall aimed to look at the data for more of a wellness perspective, in terms of improving their physical ability [116, 117], setting exercising goals [51, 91], and bringing more awareness of their physical activity [65] and emotions [35]. Physicalizations also frequently supported refection on other forms of personal data (10/47), such as one's reading habit [45], schedule [57], diet [90], fabrication lab practices [27], and Twitter data [51, 73]. Finally, there are physicalizations that focus on encoding environmental data (10/47), touching upon topics such as energy [13, 70, 84], weather [98], and climate change [109], and geographic data (3/47). Documented [22] was the only artifact that used an image/video dataset (1/47).

### 4.2 Structure

*Shape-changing interfaces were the most popular way physicaliza-* tions embodied data (9/47). Other forms of physical embodiment included swarm robotics (5/47), TUIs (4/47), fuidic displays (3/47), *light displays (3/47), voxel prints (2/47), embedded tags (1/47), and* *edibilization (1/47). Data was also physically embodied through* *environments (9/47), people (6/47), and activities (4/47). See Figure 5* for an overview of physical embodiments. Several physicalizations (13/47) attempted to co-opt existing idioms behind common visualizations(e.g., line chart, bar chart,scatterplot). However, others used a custom data representation, leveraging the unique afordances of physicalization (see Section 5.5.2 for more details).

The majority of surveyed physicalizations incorporated elec*tronics as part of their structure (35/47), while only a quarter of* the physicalizations (12/47) did not contain any form of electronics (i.e., *non-electronic). Though the majority of the physicaliza-* tions incorporated various solid materials (43/47), fve physicalizations incorporated liquids as part of their main material choice [67, 81, 82, 84, 109]. Liquid displays leveraged a number of physical attributes to encode data, including microfuidics [67], use of vortexes as metaphors for energy production [84], surface turbulence in a pool refecting muscle use during a musical performance [82], and as the location for situated data [81, 109]. We also observed a single instance where the researcher embraced computational materiality [105]-the perspective that computers, digital information, and other intangible aspects of computational systems are also considered to be materials that can be incorporated with a physical object. Documented [22] contains an embossed visual tag that was designed to be embedded within a 3D printed object. To support DIY makers, it focuses on retrieving documentation images and videos using a smart device where the digital information contributes to the 3D object's materiality.

We observed a connection between the use of materials and whether data is represented ephemerally (i.e., data is displayed for a short period of time), persistently (i.e., data is displayed for as long as the user desires), or permanently (i.e., data is permanently embedded into the physical structure of the physicalization). Approximately half of the physicalizations were able to display data persistently (25/47) through programmatic means, while 12 displayed data ephemerally (12/47) by streaming data from sensors to outputs such as LEDs [26, 59], vibrotactile motors [2, 80], and pneumatics [87] in real-time. Ten artifacts displayed data perma*nently with non-electronic materials (10/47). Despite how long data* was displayed, position was the most popular data encoding method (23/47), followed by color (17/47), form (15/47), use of light (12/47), *vibrotactile (7/47), volume (5/47), and texture (2/47).*

### 4.3 Interactions

The surveyed physicalizations supported 61 total interactions. These interactions were categorized using the seven data interaction categories from Yi et al., [119] as well as annotate, collect, assemble (see Section 3.2.3). Of the ten data interactions, explore was the most pervasive (12/61), followed by abstract/elaborate (11/61), col*lect (9/61), encode (8/61), flter (5/61), reconfgure (5/61), connect* (4/61), assemble (3/61), select (2/61), and annotate (2/61). The majority of physicalizations enabled direct interactions (i.e., introducing interactions by requiring users to intentionally touch or manipulate the representation of data; 41/61), while some relied only on sensors (9/61) or required users to interact with a GUI (7/61).

## 5 Findings

Section 4 summarizes key distributions of diferent design decisions across the 13 design dimensions. For brevity, we now use those fndings to discuss patterns in the design space that help bridge dimensions or disciplines; reveal how structure, context, and interactions are interrelated to each other; and ofer compelling future opportunities.

### 5.1 Who are the intended audiences?

Physicalizations commonly targeted the general public (21/47), focusing on how to incorporate data into everyday activities [6, 35, 45, 73] that required little visualization literacy. Our observation matches Jansen et al. [40]'s description of the benefts of data physicalization-active perception and engagement with the dataas physicalizations commonly target accessible ambient knowledge and awareness of pervasive personal or community issues. However, people's intended engagement varied throughout our corpus. For example, Physikit [34], a system of four cubes with environmental sensors embedded inside each cube, provides active engagement. Each cube outputs the sensor data (e.g., noise, humidity, temperature) either through light, vibration, movement, or airfow. Due to its small size and discrete nature, people actively placed the Physikit cubes throughout their homes to compare environmental sensor data in the diferent parts of their house. Bookly [45], in contrast, focuses on more ambient engagement. Bookly is an interactive lamp that tracks an individual's accumulated reading time in addition to other reading metrics. Bookly's design seamlessly integrates reading progress data through a mountain-shaped holder. The mountain-shaped holder provides an intuitive place where users should place their book and emphasizes that the reading is

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA still ongoing by keeping the pages open. Bookly's overall form enables the system to naturally collect data by tracking a user's reading time once the book is picked up. Through its volumetric disk, Bookly ambiently displays the user's accumulated reading time with respect to their reading goal while the pages of the open book communicate progress.

Beyond the general public, several physicalizations were designed with a specifc audience in mind, including researchers (4/47), *children (2/47), and people with disabilities (2/47). Physicalizations* meant for these specifc sets of users focused on data exploration tasks. However, the depth of the supported data analysis varied depending on the interactions the physicalizations supported. Zooids [56] and EMERGE [101], for example, provide analytical insight from the rich number of data interactions both systems provides. Zooids is a swarm robotic system where users are able to map data instances (e.g., a student) with multiple attributes (e.g., grades, gender, letter recommendation score) to each robot. The system provides users the ability to encode, abstract/elaborate, annotate, and flter the resulting multi-dimensional data. Based on the combination of these data interactions, Zooids support collaborative decision-making, such as faculty deciding on student admissions or a family planning a vacation. EMERGE [101] similarly integrated *flter, reconfgure, abstract/elaborate, and select into their 2.5D shape-* changing display where users present and share analytical insight from a dataset. Robographics [29] and FluxMarkers [99] encourage data exploration for users with disabilities, specifcally addressing the needs of blind and low vision (BLV) people. However, Robographics and FluxMarkers supported a limited range of interactions. Both systems supported only elaborating data details (e.g., the minimum/maximum value of an x-axis) by combining auditory and physical interactions.

We also found six instances where the physicalization was meant for the creators themselves. Often, these physicalizations are in the domain of personal informatics (i.e., personally relevant information for the purpose of self-refection and self-monitoring [21]). In the process of creating the physicalizations, creators tended to use custom data mappings to incorporate meaningful refections (see Section 4 to see the topics of refections illustrated in the corpus). When analyzing and exploring the physicalization, only the creators would have insights on what the data is about. ListeningCups [14], for example, are tactile cups where each bump and groove on the surface of the cup represents the everyday ambient noise within the authors' environment. Aside from the authors who created the artifacts, others would not have an immediate context as to what data has been encoded. The authors in contrast described how they gained personal insights from their data when they held the cups during meandering conversations or while washing the dishes. This led to refections of self-inquiries such as, "Why is *the part feeling more smooth, why were we so quiet?". Friske et al.* [25] explore tensions between physicalizations use by the creator and by external audiences. They argue that a personal informatics physicalization does not have one "true" data interpretation. They question the authority of data, noting how no one has the authority to invalidate someone's data interpretation even if they did not create the artifact. They elaborate that these interpretations should not be seen as distinct but as informing each other and the ongoing understanding of the data itself.

### 5.2 Where are physicalizations used or showcased?

Analyzing how physicalizations use space provides insight into how the physicalization leverages its environment. For example, a physicalization's situatedness-a concept within the visualization [20] and other relevant HCI communities (e.g., Ubiquitous Computing [93, 112])-describes how information is integrated into its surrounding environment. However, the relationship of the physicalization to its location can also change: physicalizations are either *bounded or unbounded to a given location depending on their mo-* bility (Section 3). Bounded artifacts exist confned to a particular place and are not meant to be re-positioned. Unbounded artifacts are designed for mobility and may be relocated by users or natural forces, such as a river fow (e.g., Perovich et al. [81]). Figure 3 shows the distribution of the physicalizations using these two concepts. Traditional notions of situatedness from visualization focus on how a specifc physical location provides context to the presented data to support data comprehension and decision making. While physicalizations are often situated by location (e.g., [81, 109]), we found that situatedness also occurs through individuals (i.e., body*embedded physicalizations where the physicalization is integrated* with the body) and with respect to activities (i.e., activity-embedded physicalizations where the data refects a captured or current state of an activity, as discussed in Bressa et al. [9]). Body-embedded situatedness includes physicalizations that are meant to be worn on the body as either clothing [25, 35], shoes [69], accessories [116], or tattoos [59]. In many of these cases, the data originates from the wearer through external sensors (e.g., [35, 59]). However, Friske et al. [25] encode data through knitting, but the knitter is still the physical referrent for the data. Similarly, Woźniak et al. [116] used arm and leg bands to provide vibrotactile feedback of the wearer's elbow bend and body weight imbalance to improve their golfng stance. The arm band is situated with respect to the golfer but the situatedness extends beyond the wearer and into the activity itself, dynamically reacting to the swing in the context of the golfer's motions. These physicalizations expand the traditional notion that situatedness is siloed to location. The majority of physicalizations are bound to one location (36/47). Unbounded physicalizations are generally composed of discrete parts that can freely move across space, such as ShapeBots [100], Zooids [56], Vital + Morph [6], and Chemicals in the Creek [81]. For example, Vital + Morph is a shape-changing display allowing families to co-monitor their loved one's vital signs. Vital + Morph can be disassembled into smaller pieces where each family member can monitor diferent vital signs at various locations within a city. As an unbounded physicalization, Vital + Morph can be moved freely within and between environments across space. Being distributed across the diferent family members brings a sense of community and creates a shared understanding, illustrating how physicalizations can be situated beyond their physical environment. These examples refect and expand on the perspectives of Bressa et al. [9], who state situatedness can occur across space, time, place, activity, and through communities. We additionally found that physicalizations can be situated through the individual (i.e., the body).

REACTILE [98] CAIRNFORM [13] VENOUS MATERIALS [67] EMERGE [101] SLICE AND DICE [86] ZOOIDS [56] SHAPEBOTS [100] MAKING DATA MATTER [3]

EDIPULSE [50] WATT-I-SEE [84] LINEFORM [70] CODA [107]

PRINTED PAPER MARKERS [121] PUBLIC VISUALIZATION[12] POLYSURFACE [23] ECONUMDRUM [90]

ROBOGRAPHICS [29] AIRTOUCH [102] FLUXMARKER [99] TRANS-DOCK [71]

---

SKINTILLATES [59] TORRENT [82] PIHEARTS [2] RIPPLE [35] ENTANGLING ROLE [25] CHEMICALS IN THE CREEK [81] VITAL +MORPH [6] FANTIBLES [51] DATA-THINGS [73]

BOOKLY [45] SUBTLETEE [116] PHEB [87] SEA O'CLOCK [109] OPENING THE BLACK BOX [26] PHYSIKIT [34] DOCUMENTED [22] LISTENINGCUPS [14]

DAYCLO [57] GRAFEET [117] MOTIIS[80] ADIO [58] CAIRN [27]

LOOP [91] LAINA [65] SELF-REFLECTION [103] TANGIBLE MAP [110] ITERATIVE PERSONALIZATION

[69]

BOUNDED UNBOUNDED

USE OF SPACE

---

**Figure 3: Physicalizations classified according to their use of space and their use of context. Bounded artifacts are confined to a particular position and not meant to be repositioned. Unbounded artifacts are designed for mobility and to move freely across space. Situated and non-situated refer whether the physicalization is displaying information that is contextually relevant in its environment. All images are copyright to their respective owners.**

5.3 What design decisions contribute to a existence specifc to physicalization: embodiment, data duration,

**physicalization's materiality?** and material (Figure 4). We developed a high-level categorization

of physicalizations as either technologically-driven or contextually- Past work has analyzed physical representation in physicalization

driven by specifcally focusing on how data is manifested physically through a number of lenses, including pragmatic/artistic [15, 32],

and temporally. We identifed 11 types of embodiment (Figure 5), epistemological/ontological [76], and semiotic perspectives [77,

three classifcations of data duration (described in Section 4.2), and 120]. To understand physicality within our design space, we indistinguish between materials as either electronic or non-electronic. vestigated each artifacts' materiality and found three qualities of

Embodiment A physicalization's embodiment provides insight

into the designer's domain expertise, motivations, techniques, and

| I. Data Duration | II. Embodiment | III. Material | encoding schemes. We categorized embodiment based on how each physicalization manifested data and whether they were technologically- |
|---|---|---|---|
| Ephemeral Persistent | Technologically-Driven Shape Changing Swarm Robotics Fluidic Display | Electronic Non-Electronic | driven or contextually-driven. Technologically-driven physicaliza- tions consisted of platforms where designers leveraged technology |
| Permanent | Embedded Tags Light Display |  | to encode data. These platforms included shape-changing displays, |

Voxel Printing TUI swarm robotics, light displays, TUIs, fuidic displays, edibilization, Ediblization

vibrotactile displays, embeddable tags, and voxel prints. Within Contextually-Driven shape-changing displays, technologies ranged from infatables to

Environment Activity programmable pin arrays to actuated hand-held devices. The mate- Person

rials for technologically-driven physicalizations were chosen based on their performance or use within a particular manufacturing method (e.g., 3D printing, laser cutting, silicone molding).

**Figure 4: Conceptual space that describes the three atributes that contribute to a physicalization's materiality (i.e., presence in the world [28, 113]).**

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA

---

I. Technologically-Driven

Shape Changing Display Swarm Robots Fluidic Display Voxel Printing Light Display TUI Edibilization Embedded Tags

68

TRANS-DOCK [71] PHEB [87] ZOOIDS [56] VENOUS MATERIALS [67] MAKING DATA MATTER [3] OPENING THE BLACK BOX [27] PUBLIC VISUALIZATION [12] EDIPULSE[50] DOCUMENTED [22]

LINEFORM [70] LOOP [91] ROBOGRAPHICS [29] WATT-I-SEE[84] SLICE AND DICE[86] GRAFEET [117] CODA [107]

LAINA [65] VITAL + MORPH [6] FLUXMARKER [99] TORRENT [82] ECONUMDRUM [90] PRINTED PAPER MARKERS [121]

CAIRNFORM [13] EMERGE [101] REACTILE [98] AIRTOUCH[102]

POLYSURFACE [23] SHAPEBOTS [100]

---

II. Contextually-Driven

Environment Activity Person

68

DAYCLO [57] MOTIIS[81] SUBTLETEE [118] ENTANGLING ROLE [25] LISTENINGCUPS[14]

ADIO[58] BOOKLY [45] PIHEARTS[2] SKINTILLATES[59] SELF-REFLECTION [103]

TANGIBLE MAP [110] SEA O'CLOCK [109] DATA-THINGS [73] RIPPLE [35] ITERATIVE PERSONALIZATION

[69]

28

CHEMICALS IN THE CREEK [81] PHYSIKIT [34] FANTIBLES [51]

CAIRN[27]

---

**Figure 5: Eleven examples of physicalization embodiments identified in our corpus. The physical embodiment is categorized as either technologically- or contextually driven. All images are copyright to their respective owners.**

Physicalizations whose embodiment was contextually-driven represented data through people, environments, or activities. In these cases, physicalizations heavily relied on the context surrounding its use or the user themselves [14, 35, 59]. These systems emphasized data mapping choices similar to traditional visualization.

Material We categorized the materials used to construct a phys-

icalization as electronic or non-electronic. We intentionally do not use the more common HCI practice of describing an object as either programmable or non-programmable because non-electronic materials can be transformed through craft and other manipulations to become programmable (e.g., the Embroidered Computer [54]). We characterize a material as electronic if any manufactured component or collection of manufactured components are used to control the fow of current (microcontrollers, sensors, computers, active and passive components, etc.). Physicalizations that used electronic components can generally be reused with diferent datasets for new lines of inquiry and analysis (e.g., [23, 56, 71, 101]). Physicalizations that had no computational abilities typically targeted a single dataset (e.g., [25, 67, 103, 109]) or required manual reconstruction of the physicalization by the user.

**Data Duration. Physicalizations are often designed for one of**

three temporal durations: ephemeral, persistent, and permanent (Figure 6). Physicalizations whose data is presented ephemerally collect

and render data in real-time and cannot be recorded or recalled. We

---

found that all of these physicalizations (12/47) use sensors to collect and visually stream data. For example, Torrent [82] (Figure 6a) augments concert fute music with live water sounds. The water surface turbulence refects the futist' muscle tension throughout the performance. Physicalizations that persist ofer users some control over how long data is displayed. These physicalizations often rely on electronics and programming to specify how to retain the

---

data embedded in the physicalization. However, other systems use manual interactions to control data persistence. Venous Materials [67] (Figure 6b) uses microfuidics for tangible interactions to represent a dynamic line chart. By directly pressing on a chamber containing the liquid, a user can control the fow of liquid through the microfuidic channel with their fnger. People decide how long they would like to see data being displayed before releasing their fnger and returning the display to its original state. Physicalizations that display their data permanently are those where the data is permanently embedded or integrated into its physical structure, such as conventional 3D printed objects [3, 14, 51, 73] or handcrafted artifacts [25, 103]. Most persistent artifacts did not include any electronic materials. As noted above, such physicalizations cannot decouple materials from data [3, 25], making it difcult to repurpose the artifact for a diferent dataset without signifcant efort from the user.

### 5.4 What interactions does a physicalization afford?

As discussed in Section 3.2.3, we analyzed how the physicalization's design features (i) invite people to conduct a particular data interaction (i.e., perceived afordances), (ii) informs what the result of their performed data interaction will be (i.e., feedforward), and (iii) communicate the result of their action (i.e., feedback). Explore (i.e., to interrogate diferent subsets of the data [119]) was the most pervasive interaction technique (12/61). We saw explore applied to everyday objects (e.g., clocks [57] cups [14]) and shape-changing displays [71, 100]. Systems that supported explore allowed people to explore data either directly (akin to direct manipulation in visualization) or indirectly (i.e., akin to dynamic queries [96]; Figure 7).

Physicalizations that used direct interactions stimulated the user's sensory afordances [31]. Most such physicalizations were composed of discrete pieces where each piece is part of the system's overall interaction scheme. For example, ShapeBots [100] (Figure 7) is a swarm robotics system where each robot is encoded as a data point within a dataset. With ShapeBots, the researchers

**A B C**

**Figure 6: Examples of physicalizations with diferent data duration (i.e., how long data is displayed through its physical embodiment): (a) Torrent [82] displays data ephemerally through its use of water, (b)Venous Materials[67] displays data persistently as determined by the user, (c) Data is permanently embedded in Fantibles [51].**

.

DIRECT

Direct manipulations that simulate the user's sensory affordances

LISTENING CUPS [14] SHAPEBOTS[100] MOTIIS [80]

INDIRECT

Use of interface controls (e.g., buttons, sliders, knob)

CODA [107] TRANS-DOCK [71] DAYCLO [57]

**Figure 7: Examples of physicalizations using the explore interaction. Physicalizations using the direct mechanism uses direct manipulation of the object with a focus on sensory afordances. Indirect refers use interface controls (e.g., butons, sliders, knob) to interact with the data. FluxMarkers [99] uses speech and touch to explore the data.**

intentionally designed the robots to be small, such that the graspable, small pieces invite the user to pick up each piece and interact with the physicalization as a system of parts. ListeningCup [14] also used form to encourage interaction, inviting people to stroke the cup with their hands through its textured surface. In both cases, these systems aford feedforward by primarily appealing to the perceptual-motor skills. ShapeBots' small graspable components inform people that data can be picked up, and the texture on ListeningCup ofers visual cues as to what it might feel like .7 With the exception of ListeningCups, all physicalizations with direct interactions were made with electronics that responded immediately, changing their state to serve as feedback. For instance, moving a ShapeBot [100] from one state to another state evoked a change in height, moving a Physikit cube [34] from one part of the house to another created change in sensor readings and output in the form of light, vibration, airfow, and movement. ListeningCups, in contrast, provided feedback through its texture which could be experienced through direct touch. Physicalizations that used indirect interaction in contrast presented physical controls that people are familiar with (e.g., buttons, sliders, knobs; Figure 7). People were informed of what the interactive component (e.g., the button or slider) would do through lexical or graphical labels on the physical controls. Similar to direct mechanisms, these physicalizations communicated the result of their action by immediately changing the state of physicalization through use of electronic components. As physical artifacts, data physicalizations leverage our abilities to manipulate everyday tangible things (e.g., cups, blocks, lamps, clocks) to make sense of intangible data. In addition, data physicalizations with computational components may leverage interface conventions (e.g. sliders, knobs, buttons) to facilitate interaction. Echoing Jansen et al. [40], we observe many parallels between data physicalizations and TUIs. Examining the afordances of physicalizations might enable designers to better leverage TUI principles. The aforementioned physicalizations employ interaction techniques refecting known concepts from TUIs, such as physical interactions through graspable elements [24] and token+constraint

7For more discussion on sensory-driven design, we refer readers to Hara [30].

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA systems [104]. However, interactions within data physicalizations in our corpus-like tangible interactions-cover a wide spectrum of input techniques, from indirect physical controls to more direct coupling of tangible interfaces with digital data (e.g. [29, 98, 107], see "tangible bits" [38]) and even pushing towards programmable physical matter (e.g. [55, 67, 71], see "radical atoms" [37]).

With this breadth of diferent tangible interaction techniques and concepts available, we reiterate that-as interfaces-afordances remain a fundamental consideration while designing physicalizations [74]. Afordances for data physicalizations bridge considerations that tie context, interactions, and structure together. For instance, connecting the choice of material and embodiment to interactions can help tailor a physicalization to a particular target audience. FluxMarkers [99] and Robographics [29] connect electronic swarm robots to the BLV community. These systems both incorporate sound as either input or output and vibrotactile haptic feedback for multi-sensory interaction.

### 5.5 How do different communities approach physicalization? (And what can we learn from each other?)

Communities involved in physicalization share many of the same values, such as the importance of embodiment and designing specifc user tasks. The visualization community has illustrated the importance of understanding a user's task. A visualization whose focus is to reveal analytical insight for domain experts will be radically diferent compared to others that depict data for casual use for the general public [83]. We contend this logic also extends to physicalizations, and we see an opportunity for diferent communities to learn from each other by understanding how to best express data with respect to a given task. Physicalizations in TUI and design more deeply explored the value of refection and agency in design, ofering insight into how physicalization might promote self-awareness and prolonged engagement.

*5.5.1 Analysis: Importance ofEfectiveness. Physicalization is often* used for problem-solving and decision-making (i.e., analysis) [40]. *Analysis is the second most pervasive task (15/47), and other com-* munities can learn from the visualization community specifcally in learning how to design systems based on visual efectiveness (e.g., graphical perception) and system fexibility.

As mentioned in Section 2.1, Jansen et al. [40] laid out a research agenda for empirical work that can lead to a better understanding of the efectiveness of physical variables. Ignoring this groundwork may lead to inefective designs where people are not able to perceive changes in data through the transformations presented by the physicalization. We see this refected within our corpus where researchers have used volume to communicate changes. Two such examples include Bookly [45] and CairnFORM [13] which both encode data using volume. CairnFORM consists of a tower of ten actuatable disks which expanded and retracted in the XY plane. Participants in their user study expressed difculty in discerning the changes in the diameter of each disk. Bookly is designed with a single motorized disk that expands in the z-direction. Most of their participants did not notice the volumetric change in real-time. Both works discussed how users of their respective systems found it difcult to perceive changes in volume. However, studies in visualization show that people have trouble reasoning over changes in volume and are better at reasoning over other visual variables such as surface area [41]. Work such as [41, 61, 92] can help researchers design systems that utilize efective physical variables.

Work from the visualization community also highlights the importance of allowing systems to adapt to a given user's needs. Polysurface [23] provides such fexibility through the actual visual design of their system: the shape-changing display was confgurable to three diferent domain experts' specifc needs. In contrast, Zooids [56] and EMERGE [101] provided fexibility through data interactions. As mentioned in Section 5.1, the depth of the supported data analysis varies depending on the number of interactions available. *5.5.2 Reflection: Importance of Agency. Physicalizations designed* for refective tasks, in contrast, highlight the importance of agencyusers should be able to develop personally meaningful data mappings. These customized physicalizations tend to layer meaningmaking by encouraging the user to explore and refect as part of the design process as well as through interacting with the physicalization. A notable example comes from a user within Thudt et al.'s study [103] where tokens were used to visually distil a recipe for an "at a glance" overview. The beads used color to encode ingredients while the number of beads of a particular color encoded how much of each ingredient to use relative to one another. The mapping process inadvertently created a label for the jars of the product generated by each recipe.

Not all physicalizations for refection provided agency to the users. Data Things [73] and Fantibles [51] leveraged users' personal data such as social media posts but did not include the users in the data mapping process. This exclusion led people to alter their social media feed to reshape their physicalizations and regain their sense of agency during participatory workshops. Even though the design and encoding processes did not intentionally encourage agency, people altered their own behavior to infuence the outcome of the physicalization's form.

## 6 Discussion

Physicalization draws on traditions and practices from a number of disciplines, including data visualization, TUI, and design. Our survey aligns recent developments across these felds to establish a preliminary design space of 13 key dimensions for physicalization design and development. In developing this design space and synthesizing trends and patterns in physicalization research, we frst identify two priorities researchers and designers should consider (Section 6.1 and Section 6.2) and ofer opportunities for future work and interdisciplinary collaboration (Section 6.3).

### 6.1 Considering Context

Context grounds the visual design and functionality behind a data physicalization. We found several instances where the designers of physicalizations were not explicitly clear about the physicalizaton's context, specifcally its target audience, location, and/or task (Section 4.1). While we cannot assert that context was not considered in the design of these artifacts, context is key for both creating efective representations and for connecting relevant bodies of research across disciplines. For example, the tasks people need to

perform with their data guide many visualization design workfows and ensure the resulting physicalization communicate attributes of the data that matter to the individual [94]. Emphasizing context can help researchers identify further end-user considerations that might have not been captured by current research. Context also ofers design guides that may help strengthen physicalizations. For example, physicalizations that aim to support analysis should consider data duration-generally reducing ephemerality and aiming for more persistent or permanent designs to enable people to return to key states that elicit insight into their data (Section 5.3). Designers may also draw on concepts from data provenance to inspire new methods to physicalize data that allow analysts to retrace states of the physicalization over time during analysis [85].

### 6.2 Defining Data

We used Jansen et al.'s and Hogan and Hornecker's defnitions [32, 40] of physicalization to construct our corpus. However, there is not a clear consensus on what constitutes a physicalization and, more generally, what constitutes data. Ofenhuber [76] notes that there are several defnitions of data that vary across bodies of scholarship, including data that stems from the mind (i.e., epistemological). This perspective contrasts the traditional notion of data in the visualization community (i.e., ontological). In works such as Data Agents [48] and Imagining Movie Recommendation Algorithms [1], mundane objects were used to represent people's personal data in meaningful ways fltered through the creator's internal synthesis of the data. These systems do not meet Jansen et al.'s and Hogan and Hornecker's defnitions as data was not physically represented within the physical and visual properties of these data objects or their behaviors. Instead, the artifacts refect an internal synthesis of data, creating objects whose form is indirectly shaped by data rather than directly representing individual data points.

The refective focus of many physicalizations and their roots in design and artistic practice challenge traditional defnitions of data and data representation from communities like IEEE VIS. One concrete example is the diference in the underlying views of data between the two communities. VIS often takes positivist approach, which views knowledge and data as objectively determined [66]. In contrast, the design community frequently employs interpretivist approach where knowledge is viewed as socially constructed and refected upon. Interpretivist physicalizations consider not only the data's form, but also how that form may introduce social dynamics that shape interpretation and interaction with the physicalization (e.g., Friske et al. [25], Section 5.1). People may see the physicalization as "correct" and objective in ways that may draw into question competing interpretations of the same dataset. However, rather than invalidate a given interpretation and narrative drawn from physicalized data, we call the communities to consider a broadened defnition of data and how we approach, consider, and render it.

### 6.3 Synthesis and Use

Through our design space, we observed multiple dimensions associated with the design of data physicalization. Physicalization designers can use this design space to reason across relevant bodies of research, identify new collaborative opportunities, and explore methods for creating and evaluating physicalizations. A primary motivation of this paper is to bridge knowledge from visualization, TUI, and design in order to provide a cohesive lens of each relevant intellectual community's set of approaches, theories, and terminologies. The presented design space is intended to help designers and researchers be more cognizant of knowledge and practices emerging in other communities (Section 5.5). This need is especially pertinent as our conducted survey shows data physicalization researchers come from various backgrounds (as seen in Section 4), yet these papers seldom draw substantively on the literature of the other communities. While the lack of cross-referencing does not itself imply a lack of interchange, we also found a lack of cross-pollination of ideas, techniques, and methods. Our survey aims to bridge by presenting a shared context for exploring vital facets of physicalization design, including the value of physicalizations as means for for data communication in visualization, for expressivity and refection in design, and for understanding and demonstrating novel techniques and material use in TUI. The interdisciplinary nature of data physicalization also opens new opportunities for closer collaborations among relevant communities. As shown in Section 5.5, we argue for closer collaboration particularly from the standpoint of how cross-pollination may aid in generating new data physicalization artifacts and evaluating existing ones. This interdisciplinary cross-over can happen at both a low-level (e.g., integrating data visualization knowledge regarding visual perception) and at a higher-level (e.g., considering how data is integrated into a physicalization's overall form). Future work generating and evaluating data physicalization may beneft from a research through design approach, borrowing on related methods employed in each of the surveyed felds.

*6.3.1 Research through Design. Research through design is preva-* lent in visualization [66, 94] (often instantiated through design studies) and the broader HCI community [122] because of its emphasis on synthesizing knowledge into meaningful artifacts for both research and practice. Each data physicalization artifact is (un)consciously a product of diferent community perspectives and values. Collaborative applications of research through design in physicalization ofer an opportunity to investigate new techniques through the lens provided by each community. However, successful applications of these methods and integration of community perspectives requires considering how we can be more intentional with the physicalizations we produce to enable the blending of ideas and values. We encourage designers and researchers to refer to the criteria laid out by Zimmerman et al. [122] and Meyer and Dykes [66] for integrating rigorous design into their research practice. These frameworks emphasize synthesizing diverse considerations for constructing and evaluating research artifacts in the real world. From our analysis of the data physicalization corpus covered in this paper, two criteria stand out to us in particular:

**Invention. One example of generating new design possibilities**

is through the lens of invention [122]. For example, a multidisiplinary lens on interactive physicalization may ofer innovations for more sustainable interaction design. Section 5.3 and Section 4.3 show that most electronics physicalizations provide easy updates to data representations due to the automation and computation

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA capabilities ofered by electronic devices. These properties make the physicalization reusable with multiple datasets and often increase their data and task scalability. However, electronic physicalizations are often expensive, complex, and ecologically unsustainable [23]. Our survey shows that electronic materials are not the only technology that can provide automation and computation. Mechanical, chemical, and biological actuated physicalization ofer many of the same computational benefts of electronic physicalization while potentially being more ecologically friendly. For example, Venous Materials [67] provide interaction based on microfudiics, and Printed Paper Markers [121] employ kirigami techniques for actuation design where paper acts as buttons with tactile feedback. Future work in data physicalization can consider new or emerging domains relevant to HCI, such as the physical and biological sciences, to investigate new interaction paradigms and design dimensions.

**Extensibility/Resonance. Both Zimmerman et al. [122] and**

Meyer and Dykes [66] contend that the artifacts produced through design studies should communicate implicit, hidden knowledge and build upon existing knowledge. Applying this perspective across multiple communities may help designers better comprehend and leverage embodiment in physicalization. As discussed in Section 5.3, we identifed 11 types of physicalization embodiment. This variety indicates a growing exploration of how to materialize data. However, there is a lack of knowledge transfer among each embodiment type (i.e., technology-driven, contextually-driven) and category (e.g., shape-changing display, swarm robotics; Figure 5). Throughout our analysis, we found that researchers seldom explicitly situate their artifact within the bigger landscape of data physicalization. This approach can silo physicalizations from each other, limiting our abilities to connect between diferent innovations and subdisciplines. We anticipate that our design space can help remedy this siloing by providing a shared physical representation vocabulary. Moving forward, we encourage researchers and designers to use this design space as a starting point to draw inspiration for new physicalizations and transfer knowledge produced from their artifact to general data physicalization knowledge.

Collectively, our work suggests the need for the data visualization, TUI, and design communities to engage in a collaborative dialogue around design motivations, methods, and techniques for physicalization development. Such cross-disciplinary collaboration will lead to mutually benefcial innovation that will help advance the feld of data physicalization. We hope this paper serves as a call to action for members of these communities to recognize and take advantage of potential synergies among the relevant bodies of knowledge to drive novel approaches to physicalization.

### 6.4 Limitations

Grounded theory requires data collection in an environment constructed by the researchers. Although measures were put in place to maximize credibility and repeatability, code application depends on the defnitions and perspectives of the coders. Diferent coders may result in diferent fndings. Papers within the corpus were not always explicit with respect to each dimension and were sometimes non-exhaustive (e.g., locations or audiences were not always described), introducing additional uncertainty. To mitigate potential bias, the authors consist of researchers from various felds, and we used peer debriefng to ensure that conclusions were grounded in the data. Physicalizations are diverse not only in their structure but use and interpretation of data (Section 6.2). This diversity created challenges in determining whether a paper belonged within the corpus. While we aim for coverage of a range of HCI disciplines, our survey is not intended to be comprehensive. Physicalizations exist beyond research articles (e.g., [95, 111]), which we have not covered within our corpus. This choice limits the scope of our survey to artifacts with an emphasis on human interactions with data as a product of technological innovation (e.g., materials engineering, electronic interactions, data analytics, craft). Communities of practice outside of HCI, such as art, may ofer alternative frameworks for reasoning about physicalization design and complement the dimensions of our design space. Future work should investigate and refne the design space through the integration of a broader range of knowledge.

## 7 Conclusion

We surveyed 47 physicalizations to understand common design elements of physicalization research across visualization and HCI. We used these elements to characterize thirteen dimensions of physicalization work. Our survey revealed that physicalizations ofer solutions for a diverse range of tasks with objectives and designs that extend beyond the analytical, expert-driven focus of systems from conventional visualization research, such as emphasizing refection and public engagement. These innovations arise from the deeply cross-disciplinary traditions of the feld. We refect on these traditions and gaps in the design space to identify key open challenges in physicalization research that require rich, collaborative perspectives to address. We hope that this perspective can proactively bridge the diverse knowledge and techniques that physicalization research inspires.

## Acknowledgments

This research is sponsored in part by the U.S. National Science Foundation through grants IIS-2040489 & STEM+C 1933915.

## References

[1] Oscar Alvarado, Vero Vanden Abeele, David Geerts, Francisco Gutiérrez, and Katrien Verbert. 2021. Exploring Tangible Algorithmic Imaginaries in Movie Recommendations. In Proceedings of the Fifteenth International Conference on *Tangible, Embedded, and Embodied Interaction (Salzburg, Austria) (TEI '21). As-* sociation for Computing Machinery, New York, NY, USA, Article 12, 12 pages. https://doi.org/10.1145/3430524.3440631 [2] Ilhan Aslan, Andreas Seiderer, Chi Tai Dang, Simon Rädler, and Elisabeth André. 2020. PiHearts: Resonating Experiences of Self and Others Enabled by a Tangible Somaesthetic Design. In Proceedings of the 2020 International Conference on *Multimodal Interaction (Virtual Event, Netherlands) (ICMI'20). Association for* Computing Machinery, New York, NY, USA, 433-441. https://doi.org/10.1145/ 3382507.3418848 [3] Christoph Bader, Dominik Kolb, James C Weaver, Sunanda Sharma, Ahmed Hosny,João Costa, and Neri Oxman. 2018. Making data matter: Voxel printing for the digital fabrication of data across scales and domains. *Science advances 4,* 5 (2018), eaas8652. [4] Andrea Batch, Biswaksen Patnaik, Moses Akazue, and Niklas Elmqvist. 2020.

*Scents and Sensibility: Evaluating Information Olfactation.* Association for Computing Machinery, New York, NY, USA, 1-14. https://doi.org/10.1145/3313831. 3376733 [5] Michel Beaudouin-Lafon. 2004. Designing Interaction, Not Interfaces. In Pro*ceedings of the Working Conference on Advanced Visual Interfaces (Gallipoli, Italy)* *(AVI '04). Association for Computing Machinery, New York, NY, USA, 15-22.* https://doi.org/10.1145/989863.989865

[6] Alberto Boem and Hiroo Iwata. 2018. "It's like holding a human heart": the

design of Vital+ Morph, a shape-changing interface for remote monitoring. *AI* *& SOCIETY 33, 4 (2018), 599-619.* [7] Sean Braley, Calvin Rubens, Timothy Merritt, and Roel Vertegaal. 2018. Grid-

Drones: A Self-Levitating Physical Voxel Lattice for Interactive 3D Surface Deformations. In Proceedings of the 31st Annual ACM Symposium on User Interface Soft*ware and Technology (Berlin, Germany) (UIST '18). Association for Computing* Machinery, New York,NY, USA, 87-98. https://doi.org/10.1145/3242587.3242658 [8] Matthew Brehmer and Tamara Munzner. 2013. A multi-level typology of abstract

visualization tasks. IEEE transactions on visualization and computer graphics 19, 12 (2013), 2376-2385. [9] N. Bressa, H. Korsgaard, A. Tabard, S. Houben, and J. Vermeulen. 2022. What's

the Situation with Situated Visualization? A Survey and Perspectives on Situatedness. *IEEE Transactions on Visualization & Computer Graphics 28, 01 (jan*

2022), 107-117. https://doi.org/10.1109/TVCG.2021.3114835

[10] S. Card, J.D. Mackinlay, and B. Shneiderman. 1999. Readings in Information

Visualization: Using Vision to Think. Technical Communication Quarterly 9, 3 (1999), 347-351. [11] Matthew Chalmers. 2004. A historical view of context. *Computer Supported*

*Cooperative Work (CSCW) 13, 3-4 (2004), 223-247.* [12] Sandy Claes and Andrew Vande Moere. 2015. The Role of Tangible Interaction

in Exploring Information on Public Visualization Displays. In Proceedings ofthe *4th International Symposium on Pervasive Displays (Saarbruecken, Germany)* *(PerDis'15).Association for Computing Machinery, New York,NY, USA, 201-207.* https://doi.org/10.1145/2757710.2757733 [13] Maxime Daniel, Guillaume Rivière, and Nadine Couture. 2019. CairnFORM:

A Shape-Changing Ring Chart Notifying Renewable Energy Availability in Peripheral Locations. In Proceedings of the Thirteenth International Conference on *Tangible, Embedded, and Embodied Interaction (Tempe, Arizona, USA) (TEI '19).* Association for Computing Machinery, New York, NY, USA, 275-286. https: //doi.org/10.1145/3294109.3295634 [14] Audrey Desjardins and Timea Tihanyi. 2019. ListeningCups: A Case of Data

Tactility and Data Stories. In Proceedings of the 2019 on Designing Interactive *Systems Conference (San Diego, CA, USA) (DIS '19). Association for Computing* Machinery, New York, NY, USA, 147-160. https://doi.org/10.1145/3322276. 3323694 [15] H. Djavaherpour, F. Samavati, A. Mahdavi-Amiri, F. Yazdanbakhsh, S. Huron, R.

Levy, Y. Jansen, and L. Oehlberg. 2021. Data to Physicalization: A Survey of the Physical Rendering Process. *Computer Graphics Forum 40, 3 (2021), 569-598.* https://doi.org/10.1111/cgf.14330 [16] Paul Dourish. 2001. Where the Action is: The Foundations of Embodied Interaction.

MIT Press, Cambridge, MA, USA. [17] Pierre Dragicevic and Yvonne Jansen. [n.d.]. Ammassalik Wooden Maps. http:

//dataphys.org/list/ammassalik-wooden-maps/. Accessed: 2021-08-29. [18] Pierre Dragicevic and Yvonne Jansen. [n.d.]. Marshall Islands Stick Charts.

http://dataphys.org/list/marshall-islands-stick-charts/. Accessed: 2021-08-29. [19] Pierre Dragicevic, Yvonne Jansen, and Andrew Vande Moere. 2020. Data Physi-

*calization. Springer International Publishing, Cham, 1-51.* https://doi.org/10. 1007/978-3-319-27648-9\_94-1 [20] Neven ElSayed, Bruce Thomas, Kim Marriott, Julia Piantadosi, and Ross Smith.

2015. Situated analytics. In 2015 Big Data Visual Analytics (BDVA). IEEE, 1-8. [21] Chris Elsden, David Kirk, Mark Selby, and Chris Speed. 2015. Beyond Personal

Informatics: Designing for Experiences with Data. In Proceedings of the 33rd *Annual ACM Conference Extended Abstracts on Human Factors in Computing* *Systems (Seoul, Republic of Korea) (CHI EA '15). Association for Computing* Machinery, New York, NY, USA, 2341-2344. https://doi.org/10.1145/2702613. 2702632 [22] Omid Ettehadi, Fraser Anderson, Adam Tindale, and Sowmya Somanath. 2021.

Documented: Embedding Information onto and Retrieving Information from 3D Printed Objects. In Proceedings ofthe 2021 CHI Conference on Human Factors *in Computing Systems. Association for Computing Machinery, New York, NY,* USA, Article 424, 11 pages. https://doi.org/10.1145/3411764.3445551 [23] Aluna Everitt and Jason Alexander. 2017. PolySurface: A Design Approach for

Rapid Prototyping of Shape-Changing Displays Using Semi-Solid Surfaces. In *Proceedings ofthe 2017 Conference on Designing Interactive Systems (Edinburgh,* United Kingdom) (DIS '17). Association for Computing Machinery, New York, NY, USA, 1283-1294. https://doi.org/10.1145/3064663.3064677 [24] George W. Fitzmaurice. 1996. *Graspable User Interfaces.* Ph.D. Dissertation.

University of Toronto, CAN. Advisor(s) Buxton, William. AAINN18871. [25] Mikhaila Friske, Jordan Wirfs-Brock, and Laura Devendorf. 2020. Entangling the

Roles of Maker and Interpreter in Interpersonal Data Narratives: Explorations in Yarn and Sound. In Proceedings ofthe 2020 ACM Designing Interactive Systems *Conference. Association for Computing Machinery, New York,NY, USA, 297-310.* https://doi.org/10.1145/3357236.3395442 [26] Alexandra Gendreau Chakarov, Quentin Biddy, Jennifer Jacobs, Mimi Recker,

and Tamara Sumner. 2020. Opening the Black Box: Investigating Student Understanding of Data Displays Using Programmable Sensor Technology. In Proceed*ings ofthe 2020ACM Conference on International Computing Education Research*

(Virtual Event, New Zealand) (ICER '20). Association for Computing Machinery, New York, NY, USA, 291-301. https://doi.org/10.1145/3372782.3406268 [27] Pauline Gourlet and Thierry Dassé. 2017. <i>Cairn</i>: A Tangible Apparatus

for Situated Data Collection, Visualization and Analysis. In Proceedings of the *2017 Conference on Designing Interactive Systems (Edinburgh, United Kingdom)* *(DIS '17). Association for Computing Machinery, New York, NY, USA, 247-258.* https://doi.org/10.1145/3064663.3064794 [28] Shad Gross, Jefrey Bardzell, and Shaowen Bardzell. 2014. Structures, forms,

and stuf: the materiality and medium of interaction. Personal and Ubiquitous *Computing 18, 3 (2014), 637-649.* [29] Darren Guinness, Annika Muehlbradt, Daniel Szafr, and Shaun K. Kane. 2019.

RoboGraphics: Dynamic Tactile Graphics Powered by Mobile Robots. In The *21st International ACM SIGACCESS Conference on Computers and Accessibility* (Pittsburgh, PA, USA) (ASSETS'19). Association for Computing Machinery, New York, NY, USA, 318-328. https://doi.org/10.1145/3308561.3353804 [30] Kenya Hara. 2007. Designing design. Lars Müller Publishers. [31] Rex Hartson. 2003. Cognitive, physical, sensory, and functional afordances in interaction design. *Behaviour & Information Technology 22, 5 (2003), 315-338.* https://doi.org/10.1080/01449290310001592587 [32] Trevor Hogan and Eva Hornecker. 2012. How Does Representation Modality

Afect User-Experience of Data Artifacts?. In Haptic and Audio Interaction De*sign, Charlotte Magnusson, Delphine Szymczak, and Stephen Brewster (Eds.).* Springer Berlin Heidelberg, Berlin, Heidelberg, 141-151. [33] Eva Hornecker. 2005. A Design Theme for Tangible Interaction: Embodied

Facilitation. In ECSCW 2005, Hans Gellersen, Kjeld Schmidt, Michel Beaudouin- Lafon, and Wendy Mackay (Eds.). Springer Netherlands, Dordrecht, 23-43. [34] Steven Houben, Connie Golsteijn, Sarah Gallacher, Rose Johnson, Saskia Bakker,

Nicolai Marquardt, Licia Capra, and Yvonne Rogers. 2016. *Physikit: Da ta* *Engagemen t Through Physical Ambien t Visualiza tions in the Ho me.* Association for Computing Machinery, New York, NY, USA, 1608-1619. https: //doi.org/10.1145/2858036.2858059 [35] Noura Howell, Laura Devendorf, Tomás Alfonso Vega Gálvez, Rundong Tian,

and Kimiko Ryokai. 2018. Tensions of Da ta-Driven Refection: A Case Study of *Rea l-Ti m e E m o tion a l B iosens ing.* Association for Computing Machinery, New York, NY, USA, 1-13. https://doi.org/10.1145/3173574.3174005 [36] Carmen Hull and Wesley Willett. 2017. Building with Data: Architectural Models

as Inspiration for Data Physicalization. In Proceedings of the 201 7CHI Conferen ce *on Hu ma n Fa ctors in Co mpu ting Sys te ms. Association for Computing Machinery,* New York, NY, USA, 1217-1264. https://doi.org/10.1145/3025453.3025850 [37] Hiroshi Ishii, Dávid Lakatos, Leonardo Bonanni, and Jean-Baptiste Labrune.

2012. Radical Atoms: Beyond Tangible Bits, toward Transformable Materials. *In tera ctions 19, 1 (Jan. 2012), 38-51.* https://doi.org/10.1145/2065327.2065337 [38] Hiroshi Ishii and Brygg Ullmer. 1997. Tangible Bits: Towards Seamless Interfaces

between People, Bits and Atoms. In Proceedings ofthe ACM SIGCHI Conferen ce *on Hu m a n Fa ctors in Co mpu ting Sys te ms (Atlanta, Georgia, USA) (CHI '97).* Association for Computing Machinery, New York, NY, USA, 234-241. https: //doi.org/10.1145/258549.258715 [39] Yvonne Jansen, Pierre Dragicevic, and Jean-Daniel Fekete. 2013. *Eva lua ting*

*the Efcien cy of Phys ica l Visua liza tions.* Association for Computing Machinery, New York, NY, USA, 2593-2602. https://doi.org/10.1145/2470654.2481359 [40] Yvonne Jansen, Pierre Dragicevic, Petra Isenberg, Jason Alexander, Abhijit

Karnik, Johan Kildal, Sriram Subramanian, and Kasper Hornbæk. 2015. *Oppor-* *tu n i ties a n d Cha llenges for Da ta Phys ica liza tion.* Association for Computing Machinery, New York, NY, USA, 3227-3236. https://doi.org/10.1145/2702123. 2702180 [41] Yvonne Jansen and Kasper Hornbæk. 2015. A psychophysical investigation

of size as a physical variable. IEEE tra nsa ctions on visua liza tion a n d co mpu ter *graph ics 22, 1 (2015), 479-488.* [42] Yvonne Jansen and Kasper Hornbæk. 2016. A Psychophysical Investigation of Size as a Physical Variable. *IEEE Tra nsa ctions on Visua liza tion a n d Co mpu ter*

*Graph ics 22, 1 (2016), 479-488.* https://doi.org/10.1109/TVCG.2015.2467951

[43] Ana Jofre, Steve Szigeti, Stephen Tiefenbach Keller, Lan-Xi Dong, David

Czarnowski, Frederico Tomé, and Sara Diamond. 2015. A Tangible User Interface for Interactive Data Visualization. In Proceedings of th e 25th An n ua l In tern a tion a l *Conferen ce on Co mpu ter Sc ien ce a n d Softwa re Engin eering (Markham, Canada)* *(CASCON'15). IBM Corp., USA, 244-247.* [44] Jan Joosten. 1996. *Den ise Sch m a n dt-B essera t, How Wri ting Ca m e A b ou t.* University of Texas Press, Austin, TX, USA. [45] Somi Ju, Kyung-Ryong Lee, Subin Kim, and Young-Woo Park. 2019. *B ookly:*

*An In tera ctive Everyday Artifa ct Showing th e Ti m e of Phys ica lly A ccu m u la ted* *Rea ding A ctivi ty.* Association for Computing Machinery, New York, NY, USA, 1-8. https://doi.org/10.1145/3290605.3300614 [46] Matej Kaninsky, Sarah Gallacher, and Yvonne Rogers.2018. Confronting People's

Fears about Bats: Combining Multi-Modal and Environmentally Sensed Data to Promote Curiosity and Discovery. In Pro ceedings of th e 20 18 Des ign ing In tera ctive *Sys te ms Co nferen ce (Hong Kong, China) (DIS '18). Association for Computing* Machinery, New York, NY, USA, 931-943. https://doi.org/10.1145/3196709. 3196783

Making Data Tangible: A Cross-disciplinary Design Space for Data Physicalization CHI '22, April 29-May 5, 2022, New Orleans, LA, USA

[47] Hans G Kaper, Elizabeth Wiebel, and Sever Tipei. 1999. Data sonifcation and

sound visualization. Computing in science & engineering 1, 4 (1999), 48-58. [48] Maria Karyda,Elisa D Mekler, and Andrés Lucero.2021. Data Agents: Promoting

Refection through Meaningful Representations of Personal Data in Everyday Life. In Proceedings ofthe 2021 CHI Conference on Human Factors in Computing *Systems. Association for Computing Machinery, New York, NY, USA, Article* 367, 11 pages. https://doi.org/10.1145/3411764.3445112 [49] Maria Karyda, Danielle Wilde, and Mette Gislev Kjærsgaard. 2020. Narrative

Physicalization: Supporting Interactive Engagement With Personal Data. IEEE *Computer Graphics and Applications 41, 1 (2020), 74-86.* [50] Rohit Ashok Khot, Deepti Aggarwal, Ryan Pennings, Larissa Hjorth, and Florian 'Floyd' Mueller. 2017. <i>EdiPulse</i>: Investigating a Playful Approach to *Self-Monitoring through 3D Printed Chocolate Treats. Association for Computing* Machinery, New York, NY, USA, 6593-6607. https://doi.org/10.1145/3025453. 3025980 [51] Rohit Ashok Khot, Josh Andres, Jennifer Lai, Juerg von Kaenel, and Florian 'Floyd' Mueller. 2016. <i>Fantibles</i>: Capturing Cricket Fan's Story in 3D. In Proceedings of the 2016 ACM Conference on Designing Interactive Sys*tems (Brisbane, QLD,Australia) (DIS '16).Association for Computing Machinery,* New York, NY, USA, 883-894. https://doi.org/10.1145/2901790.2901886 [52] K. Krippendorf. 2004. Content Analysis: An Introduction to Its Methodology. Sage.

https://books.google.com/books?id=q657o3M3C8cC [53] Susan Kuchera. 2018. The Weavers and Their Information Webs: Steganography in the Textile Arts. *Ada: A Journal of Gender, New Media, and Technology 13* (2018). https://doi.org/10.5399/uo/ada.2018.13.9 [54] Ebru Kurbak. 2018. Stitching Worlds: Exploring Textiles and Electronics. Revolver

Publishing, Berlin. [55] Mathieu Le Goc, Lawrence H. Kim, Ali Parsaei, Jean-Daniel Fekete, Pierre

Dragicevic, and Sean Follmer. 2016. Zooids: Building Blocks for Swarm User Interfaces. In Proceedings of the29th Annual Symposium on UserInterface Software *and Technology (Tokyo,Japan) (UIST'16).Association for Computing Machinery,* New York, NY, USA, 97-109. https://doi.org/10.1145/2984511.2984547 [56] Mathieu Le Goc, Charles Perin, Sean Follmer, Jean-Daniel Fekete, and Pierre

Dragicevic. 2018. Dynamic composite data physicalization using wheeled microrobots. IEEE Transactions on Visualization and Computer Graphics 25, 1 (2018), 737-747. [57] Kyung-Ryong Lee, Somi Ju, Temirlan Dzhoroev, Geonil Goh, Moon-Hwan Lee,

and Young-Woo Park. 2020. DayClo: An Everyday Table Clock Providing Interac*tion with Personal Schedule Data for Self-Refection. Association for Computing* Machinery, New York, NY, USA, 1793-1806. https://doi.org/10.1145/3357236. 3395439 [58] Kyung-Ryong Lee, Beom Kim, Junyoung Kim, Hwajung Hong, and Young- Woo Park. 2021. ADIO: An Interactive Artifact Physically Representing the Intangible Digital Audiobook Listening Experience in Everyday Living Spaces. In *Proceedings ofthe 2021 CHI Conference on Human Factors in Computing Systems.* Association for Computing Machinery, New York,NY, USA, Article 164, 12 pages. https://doi.org/10.1145/3411764.3445440 [59] Joanne Lo, Doris Jung Lin Lee, Nathan Wong, David Bui, and Eric Paulos. 2016.

Skintillates: Designing and Creating Epidermal Interactions. In Proceedings *of the 2016 ACM Conference on Designing Interactive Systems (Brisbane, QLD,* Australia) (DIS '16). Association for Computing Machinery, New York, NY, USA, 853-864. https://doi.org/10.1145/2901790.2901885 [60] Dan Lockton, Tammar Zea-Wolfson,Jackie Chou, Yuhan (Antonio) Song, Erin

Ryan, and CJ Walsh. 2020. Sleep Ecologies: Tools for Snoozy Autoethnography. Association for Computing Machinery, New York, NY, USA, 1579-1591. https: //doi.org/10.1145/3357236.3395482 [61] Irene López García and Eva Hornecker. 2021. Scaling Data Physicalization -How

Does Size Infuence Experience?. In Proceedings of the Fifteenth International *Conference on Tangible, Embedded, and Embodied Interaction (Salzburg, Austria)* *(TEI '21). Association for Computing Machinery, New York, NY, USA, Article 8,* 14 pages. https://doi.org/10.1145/3430524.3440627 [62] Tara M. Madhyastha and Daniel A. Reed. 1995. Data sonifcation: Do you see

what I hear? IEEE Software 12, 2 (1995), 45-56. [63] Roozbeh Manshaei, Uzair Mayat, Aneesh Tarun, Sean DeLong, David Chiang, Justin Digregorio, Shahin Khayyer, Apurva Gupta, Matthew Kyan, and Ali Mazalek. 2019. Tangible Tensors: An Interactive System for Grasping Trends in Biological Systems Modeling. In Proceedings ofthe 2019on Creativity and Cogni*tion (San Diego, CA, USA) (C&C '19). Association for Computing Machinery,* New York, NY, USA, 41-52. https://doi.org/10.1145/3325480.3325502 [64] Santiago Marco and Agustín Gutierrez-Galvez. 2012. Signal and data processing

for machine olfaction and chemical sensing: A review. IEEE Sensors Journal 12, 11 (2012), 3189-3214. [65] Daphne Menheere, Evianne van Hartingsveldt, Mads Birkebæk, Steven Vos, and Carine Lallemand. 2021. Laina: Dynamic Data Physicalization for Slow Exercising Feedback. In Designing Interactive Systems Conference 2021 (Virtual Event, USA) (DIS '21). Association for Computing Machinery, New York, NY,

USA, 1015-1030. https://doi.org/10.1145/3461778.3462041

[66] Miriah Meyer and Jason Dykes. 2020. Criteria for Rigor in Visualization Design

Study. IEEE Transactions on Visualization and Computer Graphics 26, 1 (2020), 87-97. https://doi.org/10.1109/TVCG.2019.2934539 [67] Hila Mor, Tianyu Yu, Ken Nakagaki, Benjamin Harvey Miller, Yichen Jia, and

Hiroshi Ishii. 2020. Venous Materials: Towards Interactive Fluidic Mechanisms. Association for Computing Machinery, New York, NY, USA, 1-14. https://doi. org/10.1145/3313831.3376129 [68] Tamara Munzner. 2015. Visualization Analysis & Design. CRC Press Taylor &

Francis Group, Boca Raton, FL. [69] Troy Nachtigall, Oscar Tomico, Ron Wakkary, and Pauline van Dongen. 2019.

*Encoding Materials and Data for Iterative Personalization. Association for Com-* puting Machinery, New York, NY, USA, 1-12. https://doi.org/10.1145/3290605. 3300749 [70] Ken Nakagaki, Sean Follmer, and Hiroshi Ishii.2015. LineFORM: Actuated Curve

Interfaces for Display, Interaction, and Constraint. In Proceedings of the 28th *Annual Symposium on User Interface Software and Technology (Charlotte, NC,* USA) (UIST'15). Association for Computing Machinery, New York, NY, USA, 333-339. https://doi.org/10.1145/2807442.2807452 [71] Ken Nakagaki, Yingda (Roger) Liu, Chloe Nelson-Arzuaga, and Hiroshi Ishii. 2020. TRANS-DOCK: Expanding the Interactivity of Pin-Based Shape Displays by Docking Mechanical Transducers. In Proceedings of the Fourteenth Inter*national Conference on Tangible, Embedded, and Embodied Interaction (Sydney* NSW, Australia) (TEI'20). Association for Computing Machinery, New York,

NY, USA, 131-142. https://doi.org/10.1145/3374920.3374933

[72] Surabhi Nath. 2020. Hear Her Fear: Data Sonifcation for Sensitizing Society

on Crime Against Women in India. In IndiaHCI '20: Proceedings of the 11th *Indian Conference on Human-Computer Interaction (Online, India) (IndiaHCI* *2020). Association for Computing Machinery, New York, NY, USA, 86-91.* https: //doi.org/10.1145/3429290.3429307 [73] Bettina Nissen and John Bowers. 2015. Data-Things: Digital Fabrication Situated

*within Participatory Data Translation Activities.* Association for Computing Machinery, New York, NY, USA, 2467-2476. https://doi.org/10.1145/2702123. 2702245 [74] Donald A Norman. 1988. The Psychology of Everyday Things. Basic Books. [75] Dietmar Ofenhuber. 2020. Data by Proxy - Material Traces as Autographic Visualizations. *IEEE Transactions on Visualization and Computer Graphics 26, 1*

(2020), 98-108. https://doi.org/10.1109/TVCG.2019.2934788

[76] Dietmar Ofenhuber. 2020. What We Talk About When We Talk About Data

Physicality. IEEE Computer Graphics and Applications 40, 6 (2020), 25-37. https: //doi.org/10.1109/MCG.2020.3024146 [77] Dietmar Ofenhuber and Orkan Telhan. 2015. Indexical visualization-The dataless information display. In Ubiquitous Computing, Complexity, and Culture. Routledge, New York, NY, USA, 288-302. [78] Matthew J Page, Joanne E McKenzie, Patrick M Bossuyt, Isabelle Boutron,

Tammy C Hofmann, Cynthia D Mulrow, Larissa Shamseer, Jennifer M Tetzlaf, Elie A Akl, Sue E Brennan, Roger Chou, Julie Glanville,Jeremy M Grimshaw, Asbjørn Hróbjartsson, Manoj M Lalu, Tianjing Li, Elizabeth W Loder, Evan Mayo-Wilson, Steve McDonald, Luke A McGuinness, Lesley A Stewart, James Thomas, Andrea C Tricco, Vivian A Welch, Penny Whiting, and David Moher. 2021. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. *BMJ 372 (2021).* https://doi.org/10.1136/bmj.n71 arXiv:https://www.bmj.com/content/372/bmj.n71.full.pdf [79] Gerhard Pahl and Wolfgang Beitz. 1996. Embodiment Design. In Engineering

*design. Springer, 199-403.* [80] Jesse Pepping, Sarah Scholte, Marnix van Wijland, Milan de Meij, Günter Wallner, and Regina Bernhaupt. 2020. Motiis: Fostering Parents' Awareness of Their Adolescents Emotional Experiences during Gaming. In Proceedings *of the 11th Nordic Conference on Human-Computer Interaction: Shaping Ex-* *periences, Shaping Society (Tallinn, Estonia) (NordiCHI '20). Association for* Computing Machinery, New York, NY, USA, Article 58, 11 pages. https: //doi.org/10.1145/3419249.3420173 [81] Laura J. Perovich, Sara Ann Wylie, and Roseann Bongiovanni. 2021. Chemicals

in the Creek: designing a situated data physicalization of open government data with the community. IEEE Transactions on Visualization and Computer Graphics 27, 2 (2021), 913-923. https://doi.org/10.1109/TVCG.2020.3030472 [82] Aura Pon, Eric Pattison, Lawrence Fyfe, Laurie Radford, and Sheelagh Carpendale. 2017. <i>Torrent</i>: Integrating Embodiment, Physicalization and Musifcation in Music-Making. In Proceedings of the Eleventh International Con*ference on Tangible, Embedded, and Embodied Interaction (Yokohama, Japan)* *(TEI '17). Association for Computing Machinery, New York, NY, USA, 209-216.* https://doi.org/10.1145/3024969.3024974 [83] Zachary Pousman, John Stasko, and Michael Mateas. 2007. Casual Information Visualization: Depictions of Data in Everyday Life. *IEEE Transac-* *tions on Visualization and Computer Graphics 13, 6 (2007), 1145-1152.* https: //doi.org/10.1109/TVCG.2007.70541 [84] Filipe Quintal, Clinton Jorge, Valentina Nisi, and Nuno Nunes. 2016. Watt-I-See:

A Tangible Visualization of Energy. In Proceedings ofthe International Working *Conference on Advanced Visual Interfaces (Bari, Italy) (AVI'16). Association for*

Computing Machinery, New York, NY, USA, 120-127. https://doi.org/10.1145/ 2909132.2909270 [85] Eric D Ragan, Alex Endert, Jibonananda Sanyal, and Jian Chen. 2015. Characterizing provenance in visualization and data analysis: an organizational framework of provenance types and purposes. IEEE transactions on visualization *and computer graphics 22, 1 (2015), 31-40.* [86] Renata G. Raidou, M. Eduard Gröller, and Hsiang-Yun Wu. 2020. Slice and

Dice: A Physicalization Workfow for Anatomical Edutainment. *Computer* *Graphics Forum 39,* 7 (2020), 623-634. https://doi.org/10.1111/cgf.14173 arXiv:https://onlinelibrary.wiley.com/doi/pdf/10.1111/cgf.14173 [87] Elena Sabinson, Isha Pradhan, and Keith Evan Green. 2021. Plant-Human

Embodied Biofeedback (PheB): A Soft Robotic Surface for Emotion Regulation in Confned Physical Space. In Proceedings ofthe Fifteenth International Conference *on Tangible, Embedded, and Embodied Interaction (Salzburg, Austria) (TEI '21).* Association for Computing Machinery, New York, NY, USA, Article 89, 14 pages. https://doi.org/10.1145/3430524.3446065 [88] Deepak Ranjan Sahoo, Takuto Nakamura, Asier Marzo, Themis Omirou, Michihiro Asakawa, and Sriram Subramanian. 2016. JOLED: A Mid-Air Display Based on Electrostatic Rotation of Levitated Janus Objects. In Proceedings ofthe 29th *Annual Symposium on User Interface Software and Technology (Tokyo, Japan)* *(UIST'16). Association for Computing Machinery, New York, NY, USA, 437-448.* https://doi.org/10.1145/2984511.2984549 [89] Alper Sarikaya, Michael Gleicher, and Danielle Albers Szafr. 2018. Design Factors for Summary Visualization in Visual Analytics. *Computer* *Graphics Forum 37,* 3 (2018), 145-156. https://doi.org/10.1111/cgf.13408 arXiv:https://onlinelibrary.wiley.com/doi/pdf/10.1111/cgf.13408 [90] Kim Sauvé, Saskia Bakker, and Steven Houben. 2020. *Econundrum: Visualizing*

*the Climate Impact of Dietary Choice through a Shared Data Sculpture. Association* for Computing Machinery, New York, NY, USA, 1287-1300. https://doi.org/10. 1145/3357236.3395509 [91] Kim Sauvé, Saskia Bakker, Nicolai Marquardt, and Steven Houben. 2020. LOOP:

Exploring Physicalization of Activity Tracking Data. In Proceedings ofthe 11th *Nordic Conference on Human-Computer Interaction: Shaping Experiences, Shaping* *Society (Tallinn, Estonia) (NordiCHI'20). Association for Computing Machinery,* New York, NY, USA, Article 52, 12 pages. https://doi.org/10.1145/3419249. 3420109 [92] Kim Sauvé, David Verweij, Jason Alexander, and Steven Houben. 2021. Reconfguration Strategies with Composite Data Physicalizations. In Proceedings of *the 2021 CHI Conference on Human Factors in Computing Systems (Yokohama,* Japan) (CHI '21). Association for Computing Machinery, New York, NY, USA, Article 471, 18 pages. https://doi.org/10.1145/3411764.3445746 [93] Bill Schilit, Norman Adams, and Roy Want. 1994. Context-aware computing applications. In 1994 First Workshop on Mobile Computing Systems and Applications. IEEE, 85-90. [94] Michael Sedlmair, Miriah Meyer, and Tamara Munzner. 2012. Design study

methodology: Refections from the trenches and the stacks. IEEE transactions *on visualization and computer graphics 18, 12 (2012), 2431-2440.* [95] Adrien Segal. [n.d.]. https://www.adriensegal.com/. Accessed: 2021-09-09. [96] Ben Shneiderman. 1994. Dynamic queries for visual information seeking. IEEE

*software 11, 6 (1994), 70-77.* [97] Simon Stusak, Moritz Hobe, and Andreas Butz. 2016. If Your Mind Can Grasp It,

Your Hands Will Help. In Proceedings of the TEI'16: Tenth International Conference *on Tangible, Embedded, and Embodied Interaction (Eindhoven, Netherlands)* *(TEI'16). Association for Computing Machinery, New York, NY, USA, 92-99.* https://doi.org/10.1145/2839462.2839476 [98] Ryo Suzuki, Jun Kato, Mark D. Gross, and Tom Yeh. 2018. Reactile: Programming

*Swarm User Interfaces through Direct Physical Manipulation.* Association for Computing Machinery, New York, NY, USA, 1-13. https://doi.org/10.1145/ 3173574.3173773 [99] Ryo Suzuki, Abigale Stangl, Mark D. Gross, and Tom Yeh. 2017. FluxMarker:

Enhancing Tactile Graphics with Dynamic Tactile Markers. In Proceedings of the *19th International ACM SIGACCESS Conference on Computers and Accessibility* (Baltimore, Maryland,USA)(ASSETS'17).Association for Computing Machinery, New York, NY, USA, 190-199. https://doi.org/10.1145/3132525.3132548 [100] Ryo Suzuki, Clement Zheng, Yasuaki Kakehi, Tom Yeh, Ellen Yi-Luen Do,Mark D.

Gross, and Daniel Leithinger. 2019. ShapeBots: Shape-Changing Swarm Robots. In Proceedings of the 32nd Annual ACM Symposium on User Interface Software *and Technology (New Orleans, LA, USA) (UIST '19). Association for Computing* Machinery, New York, NY, USA, 493-505. https://doi.org/10.1145/3332165. 3347911 [101] Faisal Taher, Yvonne Jansen, Jonathan Woodruf, John Hardy, Kasper Hornbæk,

and Jason Alexander. 2017. Investigating the Use of a Dynamic Physical Bar Chart for Data Exploration and Presentation. IEEE Transactions on Visualization *and Computer Graphics 23, 1 (2017), 451-460.* https://doi.org/10.1109/TVCG. 2016.2598498 [102] Carlos E. Tejada, Raf Ramakers, Sebastian Boring, and Daniel Ashbrook. 2020.

*AirTouch: 3D-Printed Touch-Sensitive Objects Using Pneumatic Sensing. Associa-* tion for Computing Machinery, New York, NY, USA, 1-10. https://doi.org/10.

1145/3313831.3376136 [103] Alice Thudt, Uta Hinrichs, Samuel Huron, and Sheelagh Carpendale. 2018. Self-

*Refection and Personal Physicalization Construction. Association for Computing* Machinery, New York, NY, USA, 1-13. https://doi.org/10.1145/3173574.3173728 [104] Brygg Ullmer, Hiroshi Ishii, and Robert J. K. Jacob. 2005. Token+constraint

Systems for Tangible Interaction with Digital Information. ACM Trans. Comput.- *Hum. Interact. 12, 1 (March 2005), 81-118.* https://doi.org/10.1145/1057237. 1057242 [105] Anna Vallgårda and Johan Redström. 2007. *Computational Composites.* Association for Computing Machinery, New York, NY, USA, 513-522. https: //doi.org/10.1145/1240624.1240706 [106] Andrew Vande Moere and Stephanie Patel. 2010. The Physical Visualization of

Information: Designing Data Sculptures in an Educational Context. In Visual *Information Communication, Mao Lin Huang, Quang Vinh Nguyen, and Kang* Zhang (Eds.). Springer US, Boston, MA, 1-23. [107] Annemiek Veldhuis, Rong-Hao Liang, and Tilde Bekker. 2020. CoDa: Collaborative Data Interpretation Through an Interactive Tangible Scatterplot. In Proceed*ings of the Fourteenth International Conference on Tangible,Embedded, and Embod-* *ied In teraction (Sydney NSW, Australia) (TEI'20).Association for Computing Ma-* chinery, New York, NY, USA, 323-336. https://doi.org/10.1145/3374920.3374934 [108] Jo Vermeulen, Kris Luyten, Elise van den Hoven, and Karin Coninx. 2013. Crossing the Bridge over Norman's Gulf of Execution: Revealing Feedforward's True Identity. In Proceedings of the SIGCHI Conference on Hu man Factors in Co mpu ting *Syste ms. Association for Computing Machinery, New York, NY, USA, 1931-1940.* https://doi.org/10.1145/2470654.2466255 [109] Karin von Ompteda. 2019. Data Manifestation: Merging the Human World

& Global Climate Change. In 201 9 IEEE VIS Arts Progra m (VISAP). IEEE, 1-8. https://doi.org/10.1109/VISAP.2019.8900829 [110] Will Walker, Hyungie Sung, Chris Kevin Ong, and Federico Casalegno. 2017.

Exploring Spatial Meaning with a Tangible Map. In Proceedings ofthe 6th ACM *In terna tiona l Sympos iu m on Pervas ive Displays (Lugano, Switzerland) (PerDis* *'1 7).* Association for Computing Machinery, New York, NY, USA, Article 6, 8 pages. https://doi.org/10.1145/3078810.3078826 [111] Tali Weinberg. [n.d.]. Woven Climate Datascapes. https://www.taliweinberg.

com/datascapes. Accessed: 2021-09-09. [112] Mark Weiser. 1991. The Computer for the 21 st Century. Scien tifc a merican 265,

3 (1991), 94-105. [113] Mikael Wiberg. 2018. The Ma teria lity of In tera ction: No tes on the Ma teria ls of

*In tera ction Des ign.* MIT Press, Cambridge, MA, USA. [114] Mikael Wiberg and Erica Robles. 2010. Computational compositions: Aesthetics,

materials, and interaction design. *In tern a tion a l Journ a l of Des ign 4, 2* (2010), 65-76. [115] Wesley Willett, Yvonne Jansen, and Pierre Dragicevic. 2017. Embedded Data

Representations. IEEE Tra nsa ctions on Visua liza tion a n d Co mpu ter Graph ics 23, 1 (2017), 461-470. https://doi.org/10.1109/TVCG.2016.2598608 [116] Mikołaj P. Woźniak, Julia Dominiak, Michał Pieprzowski, Piotr Ładoński,

Krzysztof Grudzień, Lars Lischke, Andrzej Romanowski, and Paweł W. Woźniak. 2020. Subtletee: Augmenting Posture Awareness for Beginner Golfers. *Pro c. ACM Hu m.-Co mpu t. In tera ct.* 4, ISS, Article 204 (Nov. 2020), 24 pages. https://doi.org/10.1145/3427332 [117] Paweł W. Woźniak, Monika Zbytniewska, Francisco Kiss, and Jasmin Niess.

2021. *Ma k ing Sense of Co mp lex Ru n n ing Me trics Us ing a Mo difed Ru n n ing*

*Sho e.* Association for Computing Machinery, New York, NY, USA. https:

//doi.org/10.1145/3411764.3445506 [118] Peta Wyeth. 2008. Understanding Engagement with Tangible User Interfaces. In

*Proceedings ofth e 20th Aus tra las ia n Conferen ce on Co mpu ter-Hu m a n In tera ction:* *Des ign ing for Ha b i tus a n d Ha b i ta t (Cairns, Australia) (OZCHI'08). Association* for Computing Machinery, New York, NY, USA, 331-334. https://doi.org/10. 1145/1517744.1517810 [119] Ji Soo Yi, Youn ah Kang, John Stasko, and J.A. Jacko. 2007. Toward a Deeper

Understanding of the Role of Interaction in Information Visualization. *IEEE* *Tra nsa ctions on Visua liza tion a n d Co mpu ter Graph ics 13, 6 (2007), 1224-1231.* https://doi.org/10.1109/TVCG.2007.70515 [120] Jack Zhao and Andrew Vande Moere. 2008. Embodiment in Data Sculpture: A

Model of the Physical Visualization of Information. In Proceedings of the 3rd *In terna tiona l Conferen ce on D igi ta l In tera ctive Media in En terta in m en t a n d Arts* (Athens, Greece) (DIMEA '08). Association for Computing Machinery, New York,

NY, USA, 343-350. https://doi.org/10.1145/1413634.1413696

[121] Clement Zheng, Peter Gyory, and Ellen Yi-Luen Do. 2020. Ta ngib le In terfa ces *wi th Prin ted Paper Ma rkers.* Association for Computing Machinery, New York, NY, USA, 909-923. https://doi.org/10.1145/3357236.3395578 [122] John Zimmerman, Jodi Forlizzi, and Shelley Evenson. 2007. Research through

Design as a Method for Interaction Design Research in HCI. In Proceedings *of the SIGCHI Conferen ce on Hu m a n Fa ctors in Co mpu ting Sys te ms (San Jose,* California, USA) (CHI '0 7). Association for Computing Machinery, New York, NY, USA, 493-502. https://doi.org/10.1145/1240624.1240704
