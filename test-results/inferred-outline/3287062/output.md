# Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car

PABLO E. PAREDES∗ , Stanford University, USA STEPHANIE BALTERS, NTNU, Norway and Stanford University, USA KYLE QIAN, Stanford University, USA

ELIZABETH L. MURNANE, Stanford University, USA

FRANCISCO ORDÓÑEZ, Universidad San Francisco de Quito (USFQ), Ecuador

WENDY JU, Cornell Tech, USA JAMES A. LANDAY, Stanford University, USA

We present the use of in-car virtual reality (VR) as a way to create calm, mindful experiences for passengers and, someday, autonomous vehicle occupants. Specifically, we describe a series of studies aimed at exploring appropriate VR content, understanding the influence of car movement, and determining the length and other parameters of the simulation to avoid **184** physical discomfort. Overall, our quantitative and qualitative insights suggest calm VR applications are well suited to an automotive context. Testing combinations of VR content designed to provide the participant with a static or dynamic experience versus stationary and moving vehicle modes, we find that a simulated experience of diving in the ocean while in a moving car elicited significantly lower levels of autonomic arousal as compared with a static VR plus stationary car condition. No significant motion sickness effects were subjectively reported by participants nor observable in the data, though a crossover interaction effect reveals how incongruence between the movement of the car and movement in VR could affect nausea. We conclude with recommendations for the design of calming and mindful VR experiences in moving vehicles. CCS Concepts: • Human-centered computing → Haptic devices; Ubiquitous and mobile computing systems and tools; •

**Applied computing → Consumer health; Psychology; • Computer systems organization → Sensors and actuators;**

Additional Key Words and Phrases: Virtual Reality, Augmented Virtuality, Immersion, Presence, Mindfulness, Calmness, Stress Management, Commuting, Wellbeing, Kinesthetic Congruence, Motion Sickness, Cars, Autonomous Vehicles, Commute

ACM Reference Format:

Pablo E. Paredes, Stephanie Balters, Kyle Qian, Elizabeth L. Murnane, Francisco Ordóñez, Wendy Ju, and James A. Landay. 2018. Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car. Proc. ACM Interact. Mob. *Wearable Ubiquitous Technol. 2, 4, Article 184 (December 2018),* 21 pages. https://doi.org/10.1145/3287062

∗This is the corresponding author

---

Toyota Research Institute provided funds to assist the authors with their research but this article solely reflects the opinions and conclusions of its authors and not Toyota Research Institute or any other Toyota entity. Authors' addresses: Pablo E. Paredes, Stanford University, 3155 Porter Dr, Room 1222, Stanford, CA, 94303, USA, pparedes@stanford.edu; Stephanie Balters, NTNU, Trondheim, Norway, Stanford University, Stanford, USA, balters@stanford.edu; Kyle Qian, Stanford University, Stanford, California, USA, kyleqian@stanford.edu; Elizabeth L. Murnane, Stanford University, Stanford, USA, emurnane@stanford.edu; Francisco Ordóñez, Universidad San Francisco de Quito (USFQ), Quito, Ecuador, Francisco.ordonez@estud.usfq.edu.ec; Wendy Ju, Cornell Tech, New York City, USA, wendyju@cornell.edu; James A. Landay, Stanford University, Stanford, USA, landay@stanford.edu.

---

Permission to make digital or hard copies of all or part of this work for personal or classroom use is granted without fee provided that copies are not made or distributed for profit or commercial advantage and that copies bear this notice and the full citation on the first page. Copyrights for components of this work owned by others than ACM must be honored. Abstracting with credit is permitted. To copy otherwise, or republish, to post on servers or to redistribute to lists, requires prior specific permission and/or a fee. Request permissions from permissions@acm.org. © 2018 Association for Computing Machinery. 2474-9567/2018/12-ART184 $15.00 https://doi.org/10.1145/3287062

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:2 • P. Paredes et al.

## 1 Introduction

The mental and physical benefits of regular mindfulness practice are well documented, including to reduce stress and improve health-related quality of life [43]. With such evidence gaining recent attention, researchers are becoming increasingly interested in developing novel computing approaches to support mindfulness-based activities, with a variety of interactive systems recently emerging including the Sonic Cradle [59], Meditation Chamber [48], Squeeze [6], and Spheres of Wellbeing [55]. At the same time, virtual reality (VR) technology, which can captivate users' attention and provide a strong sense of mindful presence, has advanced to the point that it can be robustly deployed in pervasive settings. We identify the car as one such everyday context well-suited to the delivery of engaging virtual experiences that promote calmness (i.e., low stress) and mindfulness for passengers.

Specifically, full-body motion in VR can greatly enhance perceptions of immersion and presence, as long as kinesthetic congruence between visual and vestibular information is maintained [20]. Further, 40 million people in the United States alone spend close to 1 hour every day commuting by car [57], many of whom are passenger-based commuters. In fact, the most recently available data from the U.S. Census Bureau shows an increase in carpooling in 9 of the country's 10 largest cities as well as nationwide overall, potentially as a result of the increasing adoption of ride-sharing apps [58]. Someday, driverless vehicles promise to boost the proportion of passengers on the road even more. Taken altogether, the car commute thus presents itself as an opportune time for delivering mindfulness-enhancing VR experiences to passengers - motivating research to more rigorously investigate the viability of such an approach.

In this paper, we explore the use of (off-the-shelf) VR content mixed with car movement to deliver calm, mindful experiences. Towards this goal, we describe the design and evaluation of our passenger-based VR system, including to detail a series of exploratory tests aimed at choosing and fine-tuning our simulations and system setup. More specifically, our pilot study (N=12) produced two main insights regarding the computational requirements necessary to support high performance VR in a moving vehicle as well as the type of VR content that is able to elicit both engagement and relaxation from users. Our subsequent controlled study (N=15) investigated the interplay between calm VR content and the effects of car movement by examining two factors: a) static versus dynamic content (an island and a ocean dive, respectively) and b) a stationary or a moving vehicle. We observed that the dynamic ocean scenario in a moving vehicle was significantly more calming (as measured by reduced autonomic arousal) than the static island condition in a stationary car. In addition, we report on our findings regarding how long people could use our VR-in-the-car system before wanting to stop (e.g., due to motion sickness). Encouragingly, no user found it necessary to remove the VR headset nor end the experiment early, which we believe can be attributed to our selected content and system setup.

## 2 Related Work

To provide background, we review the design principles of immersion and presence (including the similarities between those states and mindfulness), and we describe relevant work applying virtual reality in the car or other moving setups.

### 2.1 Immersion, Presence, and Mindfulness in the Context of VR

An immersive VR technology aims to envelop the senses with computer generated stimuli [5], while presence in a virtual environment is defined as the perception of being physically present in that non-physical world [35]. Today, most VR systems leverage visual and audio stimuli to create a sensation of presence [13], and some systems use haptic floors or hand-held controllers to increase the level of immersion [11].

Relatedly, mindfulness is an attribute of consciousness known to be related to a state of wellbeing that can be thought of as a deliberate engagement with the present moment [10]. To be mindful implies that a person is attentive and aware of the current experience. Nyanaponika Thera called mindfulness "the clear and single-minded

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:3 awareness of what actually happens to us and in us at the successive moments of perception" [54] and Hahn defined it as "keeping one's consciousness alive to the present reality" [24]. Furthermore, Kabat-Zinn describes the power of mindfulness-based interventions to reduce stress and improve recovery in clinical settings [29]. Mindfulness and VR-based immersion therefore share several fundamental characteristics related to attentive experience.

Recent work has shown that VR offers an opportunity to promote mindfulness [2] and that integrating biofeedback mechanisms can further enhance the mindful experience [3]. The bulk of related research on mindful VR has focused on expressive or therapeutic applications for chronic illnesses such as borderline personality disorder [36, 55], dementia [28], fibromyalgia [8], or chronic pain more generally [21] - though the benefits of mindfulness-based practice can have wide-ranging cognitive, emotional, and physical benefits for a broad set of individuals [22]. For instance, the Sonic Cradle places users into a dark space where the depth and frequency of their respiration shapes peaceful soundscapes that create an immersive, meditative experience [59]. Using a head-mounted display, the Meditation Chamber similarly provides a virtual environment shaped by biofeedback (galvanic skin response in this case) that guides a user through meditation experiences [48]. One of the earliest examples of an immersive virtual reality system aimed at fostering calm and relaxation is Osmose, which delivered a multi-sensory experience that involved soundscapes and nature-based visual aesthetics to foster a sense of gently floating, inspired in part by scuba diving [14].

### 2.2 Augmented Virtuality, VR Illusions, & Motion Sickness

Bridging the physical and digital worlds, augmented virtuality adds a more concrete dimension to purely simulated environments by integrating real world stimuli, such as props [37], furnishings [51], and controllers or haptic devices [46, 60].

Increasingly, VR systems have also leveraged external sensors to allow motion within a limited physical space, given proprioception can additionally play a role in the sense of presence [50]. Mobile VR systems deployed in settings like amusement parks and rollercoasters [49] take this concept to the extreme.

The effect of movement on the body's vestibular and proprioceptive feedback systems triggers an illusion of being immersed in the medium, beyond that observed in a static condition. Gonzalez-Franco and Lanier [20] describe a cognitive model of VR illusions based on three processes: bottom-up multisensory [7, 12], sensorimotor self-awareness frameworks [18], and top-down prediction manipulations [23]. Congruent multi-sensory data should make the brain "believe" that the information is true.

A discordant set of sensorial inputs, however, can generate simulator sickness [1], which can be measured using instruments like the Simulator Sickness Questionnaire (SSQ) [30]. A well coordinated design that aligns visual input with car movement, on the other hand, should avoid such physical side effects. Furthermore, a well-coordinated set of motor illusions coupled with well selected visual stimuli should reinforce the effect of both sets of signals [52].

### 2.3 In-Car Virtual Reality

Recent research has identified the opportunity that vehicles offer to enhance VR, again largely due to movement enhancing the sense of immersion. More specifically, an in-car VR system can achieve proprioceptive feedback via changes in linear and rotational acceleration. In the Car VR system, Hock et al. developed a solution to enable VR in moving vehicles, mapping vehicular movements with visual information [27]. They tested their setup with a flying 3D VR rail shooter game designed to match a specific road circuit. The authors used specific animations to help users understand acceleration and reduce confusion and motion sickness. Examining the related issue of simulator sickness, they found that moving the game in concert with the car's motion caused less discomfort compared to playing the game while the car was parked.

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:4 • P. Paredes et al.

In other work, McGill et al. investigated the concern of motion sickness with in-car VR more deeply, comparing people's discomfort in a variety of conditions: baseline VR simulator sickness, baseline motion sickness, VR mirroring the car motion, VR reflecting all rotations, VR with head motion and compensation for car motion, and VR with head motion and peripheral feedback [34]. They found that in-car VR conditions all caused more sickness than the baseline simulator and motion conditions; however, there were no statistically significant differences across the VR in-motion conditions, and users were split in their preferences for the VR in-motion conditions. Overall, their study suggested that motion sickness would represent an obstacle to use VR in the car in real-world conditions.

Our paper goes beyond such prior work in a few key ways. First, the Hock et al., and McGill et al. studies [27, 34] used a Samsung Galaxy S6 Edge and Samsung S7 smartphone, respectively. In contrast, our research explores the use of higher-end VR systems in car contexts, which we postulate will help to achieve a sufficient level of full-body kinesthetic congruence to better mitigate motion sickness. In addition, how long an in-car VR experience could be perceived as comfortable to use has not yet been benchmarked nor tested under different circumstances; in this study, we investigate both of these open questions. Finally, relevant VR research in mobile scenarios has focused primarily on applications for entertainment, while VR systems for promoting psychological well-being have only been investigated in static setups. Connecting these separate threads of research, we identify a compelling opportunity to examine the potential to enhance mindfulness through novel VR experiences deployed in mobile in-car scenarios.

## 3 System and User Experience Design Process

In this section, we describe our design decisions, which emerged from a series of exploratory tests that led to (a) our selection of a quality rendering system capable of testing VR experiences aimed at fostering calm, mindful experiences for the car and (b) our formulation of research questions to investigate the viability of this system design.

### 3.1 Piloting VR Environments and System Setup

We performed our first iteration of system design to verify the merit in using VR in a moving vehicle and to understand the type of content necessary to evoke a subjectively calm and comfortable experience. We tested two different environments where mobility played an important role: a simulation built for use with the Oculus DK2 of a Tuscany country house and its surroundings1 and an underwater river simulation from the Tennessee Aquarium that contained multiple fish from the Conasauga river2 . Not only did mobility play an important role in both simulations, but this choice allowed us to explore assorted types of experiences and interaction dynamics - in the Tuscany simulation, the user had complete control over translational and rotational movement and was in a relatively familiar real world setting, while the underwater simulation did not allow users to control translational movement and placed them in a less commonly encountered environment for humans. We used a MacBook Pro Core i7 with an integrated graphics processing unit that rendered a maximum of 45 to 60 frames per second (fps). Our setup can be seen in Figure 1.

We tested N=12 participants in both environments, counterbalancing the order of the scenarios. All tests were set in a vehicle with a fully functioning air conditioner (AC) that enabled good airflow in the car. Only three users asked to stop the experience due to motion sickness - two of them during the Tuscany simulation. The third user reported an increase in sickness in the underwater river simulation due to excessive head movement while trying to see the fish in the surroundings. More specific results from piloting both environments are as follows.

1http://fenixfire.com/fenix-fire-creates-tuscany-world-demo-for-oculus-rift/ 2https://www.wearvr.com/apps/riverecosystemconservation

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:5

![](img_p5_1.png)

Fig. 1. Experimental Setup: Participant wearing the VR Oculus System (upper left). Street view (upper right). Over-theshoulder frontal view of participant (lower right). VR view of the participant diving in the ocean (lower left).

Seven of the twelve users were either not affected or mildly affected by motion discomfort during the Tuscany scenario. They moved around the environment using computer keyboard arrow keys; the turning of the vehicle also caused displacement in the simulation. Participants reported the car turns to be disconcerting because they were hard to interpret and also led to a diminished sense of agency. Two participants did find such changes interesting, however, given they pointed their frame of view to new regions in the environment. In addition, one user described the simulation somewhat lagging while inside the house, where higher levels of detail required more rendering power.

In the underwater scenario, users were moved down the river over the course of the simulation. The forward displacement speed of movement of the river was constant. Head turns caused corresponding changes in pointof-view for the simulation; car turns had the same effect on point-of-view as well. Most of the participants did not get sick and reported high satisfaction and relaxation with the experience of being underwater in the river. They reported that the turns of the car were natural and felt like "swirls" of water. One person described the experience as "refreshing", saying that the combination of the water and the cold AC was an excellent option for a hot summer day. It is important to note that the simulation did not capture translational movement, only rotational movement. Participants did not complain about this lack of correspondence between the vehicle speed and experienced translational movement, but they did complain when rotational acceleration did not match their simulated experience. Similar to the Tuscany simulation, a few participants described some lagging effects when multiple fish were in the scene.

Overall, the degree of motion discomfort experienced by our participants was less than what we had expected based on previous research, and people had generally positive reactions to the experience. Users found translational

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:6 • P. Paredes et al.

![](img_p6_2.png)

![](img_p6_1.png)

(a) Dynamic - Swimming with whales. (b) Static - Meditating on an island.

Fig. 2. VR movement experiences: (a) Ocean Rift (Whales)3 (b) Nature Treks VR (Island)4 .

movement to be less of an issue for discomfort, as compared to rotational movement. However, people did find sudden breaks or accelerations uncomfortable, similar to the reaction to "breaking" observed by [27]. Based on these promising findings, we moved forward to address two main challenges: improving the graphics rendering performance of the system and selecting content that generated less discomfort. We hypothesized that a main reason people preferred the underwater scene was mainly because of the congruence between car movement and virtual experience, despite having a constant translational speed. We therefore also set out to determine appropriate content to test this movement congruence hypothesis.

Finally, at least one participant mentioned a pleasant relationship between the vibration from the road and the flow of the water - this is consistent with prior findings around enhanced valence (pleasure) for congruent affective multi-sensory interactions [39].

### 3.2 System Enhancements

To increase VR rendering performance, we deployed an MSI gaming laptop with an Intel Core i7 and an Nvidia GTX 980 GPU - the most powerful consumer GPU available at the time. We also tested VR head-mounted-displays (HMD) that supported higher fps rates. None of these HMDs were suitable, however, as they all required external sensors to function. Attempting to fix these sensors to the body of the vehicle caused graphical glitches in the HMD during use, as the sensors were designed for use in static environments. Ultimately, we returned to the Oculus DK2, which was the best system that could track head movement without requiring external sensors. With our enhanced GPU setup, the DK2 was able to deliver 75 fps, which we found was sufficient to deliver a high quality experience for most off-the-shelf content.

We next focused our attention on finding off-the-shelf applications designed to support calmness or mindfulness (250Hz) and that would allow us to investigate the range between dynamic (in motion) or static (always in one place) simulations 2. Exploring dynamic content, we tried a few off-the-self applications that provided experiences of floating in outer space, navigating inside the human body, or moving within abstract artistic structures. Based on the positive experience of the river simulation during our pilot, we also tried the game Ocean Rift version 1.123 that allows users to swim in different scenes of the ocean, from coral reefs to the deep ocean. Informal feedback sessions found that people enjoyed the underwater experience, but not with animals they felt were scary (e.g., sharks or orcas). We settled on the "Humpback Whale" scene, as seen in Figure 2a.

Exploring static content, we tried a few 3D movies, 2D movie theaters, and nature scenes that were explicitly advertised to be designed to relax their users. Ultimately, we chose a meditation application, Nature Treks VR

3https://www.oculus.com/experiences/rift/1253785157981619/

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:7

Version 1.174 and selected the island scenario, as seen in Figure 2b, based on informal feedback and to thematically complement the ocean application.

### 3.3 Research Questions

Motivated by the vision to ultimately transform a passenger-based commute or futuristic robot-taxi5 ride into a daily period of calm, mindful experience, we pursue the following research questions regarding basic viability of such a system: *R1: Can calming VR experiences reduce autonomic arousal in a moving vehicle and, ifso, would it be preferable* *to match the movement ofthe vehicle with a VR experience designed for dynamic exploration ofthe setting?* *R2: Is using an off-the-shelf calming VR application in a moving vehicle associated with an increase in motion* *sickness and, if so, for how long and under which driving condition(s) is it feasible for a user to engage with the* *experience?* In complement, we explore the potential of full-body kinesthetic congruence in a moving vehicle to create a more mindful experience. In the next section, we describe the two-part experiment we undertook to address these questions.

## 4 Methodology

Here we describe the details of our on-the-road, controlled experiment designed to examine our research questions - i.e., the effectiveness of our calming VR experience for the car, along with issues related to motion sickness and full-body kinesthetic congruence.

### 4.1 Experiment Design

We designed an experiment with two separate parts: first we performed a controlled experiment to test dynamic full-body kinesthetic congruence between car movement and VR movement experience (Part A), and we then applied an endurance test to observe the effects of sustained driving duration and variable driving environments (neighborhood, mountainous roads, and highway segments) on motion sickness (Part B). Figure 3 illustrates these two parts. It is worth noting that while Part A of the experiment does not depend on the data or methods from Part B, the endurance test of Part B is (desirably) impacted by the built-up fatigue already experienced during Part A.

4http://greenergames.net/ 5https://www.bbc.com/news/technology-42238112

![](img_p7_1.png)

Fig. 3. Experiment design.

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:8 • P. Paredes et al.

*Part A: Effects ofDynamic Full-Body Kinesthetic Congruence on Arousal. We chose a 2x2 within-subjects (N=15)* factorial design to test the interaction effects of car movement (stationary vs. moving) and VR movement experience (static island vs. dynamic ocean) on self-reported and physiological arousal (see Figure 3 - Part A). Note that we use the "VR movement experience" variable to reflect the movement as well as the setting of the VR content - a decision we made based on our piloting experiences. That is, we first identified during piloting that any type of VR setting where users are roaming freely on land with a horizon, while the car is moving, had the potential to be much more discomforting, which would preclude dynamic delivery of such a setting. Further, these island and ocean scenarios were designed to be intrinsically static and dynamic (i.e., fixed resting/meditative position and diving in flowing water), respectively; and pilot participants did express that using them in the opposite way (dynamic island, static ocean) did not make intuitive sense and was perceived as unnatural, distracting or uncomfortable. Motivated to avoid both physical and psychological discomfort of users, we therefore defined our "VR movement experience" variable with static island vs. dynamic ocean as levels. The combinations of these factors can be categorized as "congruent" tasks: Stationary Car+Static VR, Moving Car+Dynamic VR and "incongruent" tasks: Moving Car+Static VR, Stationary Car+Dynamic VR. Each condition had 15 participants each - i.e., each participant experienced all four conditions in a balanced Latin square randomized order [26]. That is, we eliminated ordering and carry-over effects by ensuring that every condition occurred in each ordered position and that every condition precedes every other one. Although a within-subjects design guarantees that all conditions have the same number of participants, one of the conditions had a small ordering effect bias, because we realized at the time of analysis the need to exclude one person's data due to faulty sensor measurements. We opted against later recruiting an additional participant, as the circumstances of a new recruit's experience would have been considerably different by that point - e.g., due to a developer update to the VR content that made it no longer possible to administer the same simulation as delivered to the original sample. Although the ordering effects should be marginal, we estimated them by performing a one-way repeated measures ANOVA on the randomized data, and we found no effects in any of the dependent variables. As Part A has no methodological or data dependence from Part B, no additional partition of the data needs to be performed. The specific hypotheses informed by our piloting phase that Part A set out to test can be formulated as follows:

*H1.1: Congruent conditions will be more calming (lower autonomic arousal) than incongruent conditions. H1.2: Among the congruent conditions, the dynamic congruent condition will be more calming (lower autonomic arousal) than the static congruent condition. H2: Incongruent conditions have a more negative impact on motion sickness than congruent ones.*

*Part B: Endurance Test for Moving Car Conditions. After the conclusion of Part A, we performed an endurance* test (Part B). Note that we did not counterbalance Parts A and B, as we wanted to build up participants' fatigue from Part A. Part B had a between-subjects design with participants assigned to two different groups and lasted 15.02 ± 1.03 min, with the aim of observing the effects on motion sickness of a realistic drive (e.g., that might emulate a typical commute) with a variety of driving environments, including neighborhood, mountainous roads, and highway sections. Half of participants experienced the incongruent island scene Moving Car+Static VR (15.38 ± 0.85 min) and half the congruent ocean scene Moving Car+Dynamic VR (14.6 ± 1.12 min) (see Figure 3 - Part B).

After the completion of both Part A and Part B, we asked each participant several open-text questions to obtain qualitative information on perceived engagement, mindfulness, and personal preferences. The next section explains additional data collected during both parts of the experiment.

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:9

### 4.2 Data Collection

To answer the proposed research questions and hypotheses, we collected physiological and self-reported arousal level, subjective assessment of motion sickness, and ancillary data to explore mindfulness and engagement. *4.2.1 Autonomic Arousal. To answer RQ1 and its associated hypotheses, we used a commonly used battery* of physiological (Heart Rate Variability - HRV, Breathing Rate - BR, Electro-dermal Activity - EDA) and selfreport measures of autonomic arousal (i.e. stress/calmness information) [4, 25, 38, 40, 41, 53]. Using this set of instruments not only enabled us to incorporate subjective assessments of arousal but also helped address limitations of physiology measurements from confounds such as motion artifacts, exertion, speaking artifacts, and environmental temperature, among others.

*Physiology Data. We obtained data from two physiological devices: from the Zephyr BioModule Device* 3.06 , we obtained Electrocardiogram - ECG (250Hz) and Breathing Rate - BR (1Hz), and from the Empatica E4 sensor7 , we obtained EDA (4Hz). We derived heart rate variability (HRV) from ECG, which is commonly evaluated in the time-domain using Root Mean Square of Subsequent Samples (RMSSD). For EDA, we obtained its phasic component (rather than its tonic component, which changes over long periods of time and is influenced by temperature). The EDA-phasic component is well-accepted as a proxy for quantifying momentary changes in arousal [16], measured as the number of events or peaks captured during an experimental condition.

*Self-reported Data.* Self-reported psychometrics were obtained after each of the seven tasks (see Figure 6). We used the Circumplex Model of Affect [47] to capture Arousal/Energy (low = 0 to high = 10) and Valence (unpleasant = 0 to pleasant = 10). We used the Perceived Stress Scale to capture Stress levels from low = 0 to high = 10 [44]. *4.2.2 Motion Sickness. To explore RQ2, we assessed physical symptoms of motion sickness using the Simulator* *Sickness Questionnaire (SSQ) [30], which subjectively assesses 16 different physiological symptoms on a four* rank scale (none = 0 to severe = 3). SSQ symptoms define three scores, which together form the Total SSQ Score: *Nausea, Oculomotor Discomfort, and Disorientation. One limitation of the SSQ is it was originally designed for* complex simulators [30, 42] and may not be well suited to our "subtle" experience. To compensate for this problem we also captured qualitative, open-ended information on people's perceptions of their motion sickness. *4.2.3 Ancillary Data. Finally, we collected ancillary data to explore the potential effects on engagement and* mindfulness, which should be relevant only in case we found relevant effects on the research questions. We do not expect to generalize any findings, but rather to open new research questions that could be valuable to explore these elaborate concepts.

*Engagement. We captured subjective and objective measurements associated with engagement: a) we captured* a subjective assessment of the level of Concentration ranging from low = 0 to high = 10, and b) we used an inter-rater reliability method to code our video data to grade the level of Head Movement for each of the four conditions on a scale from no head movement = 0 to constant head movement = 5.

*Mindful Meditation. We used a validated scale for mindful meditation, the Toronto Mindfulness Scale (TMS)* [32], which includes 13 statements evaluated on a 5-rank scale (not at all = 0 to very much = 4). One important observation is that this scale is geared towards assessing meditation practices that focus on awareness of thoughts and feelings, as opposed to a focus on perception. VR-based mindfulness scales are not available, and therefore we complemented our information with an individual qualitative assessment captured in open text post-test questions.

6https://www.zephyranywhere.com/ 7https://www.empatica.com/

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:10 • P. Paredes et al.

![](img_p10_2.png)

![](img_p10_1.png)

Fig. 4. Experimenter 1 (E1) driving the car, participant in the front passenger seat, and Experimenter 2 (E2) in the back seat managing the VR system.

Fig. 5. Experimental driving course. Short driving course (green) around the block of the research facility and long driving course (blue) that included residential, highway, and rural mountainous roads.

### 4.3 Apparatus

*Car Setup. We conducted all tests in the same vehicle used during our piloting phase, a sedan with fully* functional AC. The participant was seated in the front passenger seat. Experimenter E1 drove the vehicle while experimenter E2 provided technical assistance, such as helping the participant put on the headset (see Figure 4). We recorded the experiment with four cameras: a frontal view of the participant, a frontal view of E1, a lateral view of the interior of the cabin, and a view of the road ahead. To maintain consistency in driving style, the same experimenter, E1, was designated as the driver across all participants. *VR Movement Experience. During the Moving Car+Dynamic VR condition, the ocean game automatically* matched lateral (rotational) movement both from the car and from the participant's head through the HMD, which was the movement reported to have the greatest impact on user experience. Informed by our piloting phase and recommendations from related work [27], we decided to keep the translational movement constant to reduce any potential effects of sudden acceleration and deceleration. We employed two techniques to accomplish this: 1) training the driver to perform smooth acceleration and deceleration patterns and 2) keeping the translational (forward/backward) movement as a binary value, which was activated by a game controller manipulated by E2. Specifically, the controller would generate a constant translational speed while the car was moving - similar to the piloted river application - and no movement when the car was stationary. That is, as soon as the car moved, E2's use of the controller would move the VR scene forward at a constant speed; and as soon as the car stopped, E2 would stop using the controller so that no movement in VR occurred. This approach eliminated the risk of discrepancies, as the human operator was not attempting to manually match the rate of the VR movement to the speed of the car. During the incongruent Stationary Car+Dynamic VR condition, E2 maintained constant translational movement, producing essentially the opposite of the Moving Car+Static VR condition. We ran calibration pilots to ensure this binary translational movement of the VR motion corresponded well to the movement of the car. Furthermore, E1 was always the same driver and was trained to drive in a very conservative and smooth style, with no sudden movements or jolts, resembling how an autonomous car might drive. It is worth noting that even though related work had success connecting the VR system to car sensors (e.g., OBD - onboard diagnostics) in order to automatically match car movements with dynamics of the VR experience [27, 34], we found a human operator to be the most appropriate and feasible solution for our use case, as it

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:11

![](img_p11_1.png)

Fig. 6. Experimental timeline, illustrating seven study components (physiological baseline, driving baseline, tasks 1-4, endurance test), each followed by administration of subjective questionnaires (SQ).

was difficult otherwise to achieve the necessary level of synchronization to deliver the type of content we were working with and promote a calming experience for an extended period of time (i.e., render at high FPS resolution with high end content, without creating artifacts in the experience). Other work has similarly identified the importance of delivering high quality graphics in VR rendering, especially to avoid distraction and discomfort [15, 19]. As the focus of the experiment was testing the proof of concept (whether people would even enjoy, benefit from, and be able to physically withstand the experience), solving these significant technical challenges was therefore outside the scope of this work, though this clearly provides ample opportunities for future research.

*Driving Courses. Two driving courses were selected: a short course, driven around once for 0.7 miles (see* Figure 5 - green circuit) and a long course, spanning 6.1 miles of residential street areas, one exit-to-exit highway passage, and a rural mountainous road (Figure 5 - blue circuit). E1 was trained to drive the car in a conservative, smooth manner, avoiding harsh acceleration and deceleration hard curves.

### 4.4 Procedure

The overall evaluation lasted approximately 50 minutes and consisted of seven components, as illustrated in Figure 6: (1) physiological baseline, (2) driving baseline, (3) - (6) motion congruence experiment tasks (3 minutes each), and (7) endurance test. Each component was followed by administration of our subjective questionnaires (e.g., TMS, SSQ, etc., as described in Section 4.2), which also served as a break (of M=3.55 minutes, SD=1.1, which aligns with the duration of breaks specified in the literature [17]) between tasks, to minimize carry-over effects.

The experiments were scheduled between 10:30AM and 3PM to avoid traffic due to rush hour and school times. After completing a pre-test questionnaire, which asked about demographics, commuting behaviors, and experience with mindfulness, each participant was guided to a separate room to be outfitted with the physiological sensors. The participant was then taken to the garage and asked to sit in the front passenger seat. E1 instructed the participant to adjust the temperature to a level of her/his comfort and then drove the car to the designed start location for the experiment. The car's engine was left on during the entire experiment to ensure continuity in the car cabin's temperature. After the experiment was over, the sensors were removed and the participant filled out a post-test questionnaire about overall reactions, preferences, and suggestions.

### 4.5 Participants

A total of N=15 participants (7 females, 8 males) participated in the study. In Part A (within-subjects factorial design), each participant experienced all four conditions in randomized order. In Part B (between-subjects exploratory design), participants were assigned to two different groups.

Ages ranged from 21 to 79 years (M=38.4, SD=16.7). Five participants reported using VR systems a few times or more, four tried it once, and six participants had no prior VR experience. Ten participants reported that they commuted every day or a few days a week to work by car, and five participants reported never or only once a month commuting by car to work. Six participants reported practicing some form of mindfulness practice at least

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:12 • P. Paredes et al.

Fig. 7. Electrodermal Activity.

Fig. 8. Simulator Sickness Question- Fig. 9. Engagement - Head Movement naire - Total Interaction Effects. Interaction Effect.

once a week (e.g., yoga, martial arts, meditation), four participants reported never trying mindfulness activities, and the remaining five reported monthly or less frequent practice. All participants had corrected-to-normal vision and were right handed.

## 5 Results

We present both quantitative results as well as qualitative observations for the congruence and endurance tests. Unless stated otherwise, for the factorial data, we performed a two-way repeated measures ANOVA to determine the main effects and interaction effects of car movement and VR movement experience.

### 5.1 Quantitative Results

*5.1.1 Autonomic Arousal. We contrast traditional measurements of arousal based on ECG and EDA measurements,* breathing rate, as a potential mediator of arousal, and self-reported levels to observe the level of subjective awareness of arousal changes.

*Physiology: No interaction or main effects were observed in HRV (RMSSD). For EDA, no interaction effects* were observed, which together with the prior finding, contradict H1.1. However, main effects were observed for car movement (stationary versus moving) on EDA F(1,14) = 4.878, p < 0.05. Multiple comparisons revealed a difference across the two congruent conditions: Moving Car+Dynamic VR was significantly lower than Stationary Car+Static VR (mean difference = 0.365, p < 0.05, see Figure 7), and Moving Car+Dynamic VR was significantly lower than a resting baseline, t(14) = 2.819, p < 0.05. This confirms hypothesis H1.2 - that among congruent conditions, a moving condition will be more calming and elicit lower arousal states than a static condition. This finding reveals that using calming VR content in a moving car can actually be more relaxing than simply sitting and relaxing in a chair or by using a stationary mindfulness application.

*Breathing Rate also showed a main effect of car movement: F(1,14)=12.291, p < 0.01. Multiple comparisons* revealed a difference between Moving Car+Static VR and Stationary Car+Dynamic VR (mean difference = 0.394, p < 0.05) as well as difference between Moving Car+Static VR and Moving Car+Dynamic VR (difference = 0.361, p < 0.05). This reveals an effect of driving on breathing rate. When corrected against a driving baseline, the effect size of the VR driving conditions disappears, which may indicate that breathing rate simply increases with driving. This finding resonates with prior work that observes a reduction in arousal along with an increment in breathing rate can be seen among novice practitioners of meditation [33, 57]. Using background information about the level of prior experience with mindfulness activities and commuting behaviors, we further explored

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:13 differences between participants who we might refer to as "novices" and "experts". We found no noticeable differences - however, a larger experiment is needed to statistically verify this finding.

*Self-Reported Metrics:* All values were normalized and corrected against baseline. Analysis showed no significant differences in subjective stress, arousal, and valence between the "island" and "ocean" simulations averaged over both stationary and moving conditions, confirming that we did in fact select subjectively calming VR simulations. Our qualitative results provide further detail regarding psychological perceptions of the VR experience. *5.1.2 Motion Sickness. We analyze the short term effects of the simulated experience and the reaction to a* long-term exposure during the endurance phase.

*Simulator Sickness: No main effects were observed for SSQ data, though we did observe interaction effects:* *F(1,14) = 4.778, p < 0.05 (see Figure 8). More specifically, SSQ Nausea seems to be the main source of this interaction* effect: F(1,14) = 5.510, p < 0.05. This refutes hypothesis H2. Congruent tasks seem to be more prone to sickness than the incongruent ones, which is somewhat contradictory with prior work that assumes perceptual congruence enriches VR experience [20]. Considering we found no main effects nor individual differences, we believe this increased risk of sickness stems from higher levels of head movement, which congruent content can elicit, as described in the next section.

Due to the complexity of SSQ, given it was originally designed for complex simulators [30, 42], we validated SSQ measures with an additional qualitative examination. When asked about past experiences with motion sickness, most of our participants (12/15) reported that they never feel motion sickness as a passenger in a car. This ratio is representative of a general population, as other studies report that only between 4 and 22% of passengers experience motion sickness [56]. Similarly, none of these participants reported feeling nausea or motion sickness during our experiment. Two participants reported that they feel nausea sometimes as passengers; only one of them reported feeling nausea during the experiment. The remaining participant reported always feeling motion sickness but did not report motion sickness in the experiment. Together, these instrument- and observation-based assessments of simulator sickness indicate that our system was reasonably successful at generating less user discomfort. In our study, the following parameters seemed particularly key: the controlled acceleration of the car, the less distracting VR content, and the use of a high end frame rate when rending graphics. A desirable starting point for future research would be to validate these specific factors.

*Endurance: Unexpectedly, none of our participants requested to stop the experiment during the 15 minute* endurance test that happened after all the four VR conditions were presented. However, some users did report the need to stop moving their head due to initial feelings of motion sickness. *5.1.3 Engagement and Mindfulness. Finally, we revise engagement metrics such as concentration and head* movement, as well as the results of applying theoretical mindfulness psychometrics.

*Engagement: No significant main effects were found for Concentration or Head Movement. Interaction effects* were observed only for Head Movements, F(1,14) = 4.773, p < 0.05 (see Figure 9). No pairwise comparisons were significant. This means that the movement of the car had an effect on head movement depending on the type of scenario. This finding, in conjunction with an observed interaction effect of congruence on motion sickness (described below), suggests that the more engaging nature of congruent content leads people to move their head more in order to track this VR scenery. For example, prior work has found that looking downwards in VR has an effect on motion sickness [45], and some participants in the ocean scene did repeatedly look downwards to see the bottom of the sea or fish swimming underneath them in the simulation. Our data thus suggests that a more engaging scene may lead to motion sickness, depending on the type of content and the location of the visual stimuli.

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:14 • P. Paredes et al.

*Mindfulness: We found no interaction nor main effects on the Toronto Mindfulness Scale(TMS): TMS-curiosity,* F = (1,5) = 2.795, p = .359; TMS-de-centering, F = (1,6) = .333, p = .585. However, these results seem to be at odds with the level of head activity. In the next section we further complement these findings with qualitative information to further explore this apparent contradiction.

In summary, quantitative results show that congruence is not the dominant factor for lower arousal, but rather movement. Quite the opposite, congruent VR experiences could be prone to motion sickness due to the increased level of head movement, which if controlled, can allow users to withstand a long-lasting VR experience. Further, we did not find preliminary evidence that experience with mindfulness or commuting impacts the VR experience, nor did we find effects with respect to the validated mindfulness scale. We see this lattermost finding as particularly interesting and worthy of attention in future research, as it suggests that traditional mindfulness assessments seem to be at odds with the level of activity elicited in the congruent conditions - and so it is worth exploring other constructs and/or instruments that could better represent the calm, engaged states our participants experienced.

### 5.2 Qualitative and User Experience Analysis

In this section, we present qualitative findings regarding participants' overall experiences with the system. We organize findings around themes of Immersion, Emotional Response and Mindfulness, and Preferences and *Suggestions, which emerged from an iterative thematic analysis [9] conducted by three researchers.* *5.2.1 Immersion. Nearly half (7/15) of participants found the experience to be immersive and create a sense of* presence, like they were being transported to the simulated environment (e.g., "It was a very strong feeling that I *was in a different surrounding, and I noticed many of the things around me." - P14). This sense of attention and* desire to engage with the virtual content was also reported by several participants (e.g., "I was really curious to *see everything around me. I didn't want to miss more monkeys or whales" - P6).*

The movement of the car was also called out as an aspect of the experience that could strongly enhance perceptions of immersion. Six participants found car turns and corresponding simulation turns to be odd, though, as it made the environment change without their input - however a sense of full-body kinesthetic congruence was still perceived given the physical and virtual turning directions aligned with each other. In contrast, a few participants (4/15) found the car interfered with their sense of virtual presence (e.g., "I was still very much aware *that I was sitting in a car seat." - P12). One participant also found that physiological sensations reduced feelings* of immersion: "In moving VR, I was more concerned about my nausea and much less mindful" (P2). *5.2.2 Emotional Response and Mindfulness. Next, we observed that the system altered people's emotions and* other psychological states in various ways. Less than half (6/15) of participants found the simulations to be "very relaxing" and that they promoted a mindful awareness (e.g., "[the simulation] made me think about accepting *certain feelings and remain calm in the moment" - P4). These feelings could also ebb and flow over the course of* the virtual experience, often progressing from more aroused emotions like excitement into an eventual meditative sleepiness. As one participant put it: "I was smiling ear to ear at first - felt euphoric.. then relaxed, then sleepy on *the last long drive" (P6).* *5.2.3 Preferences and Suggestions. We reveal three relevant themes around personal preferences, reactions to* (mild) motion sickness, and interesting social dynamics.

*Personal Preferences: Overall, participants had diverse reactions to the experience of VR in a car. More than half* (8/15) liked the moving condition, describing it, for instance, as a "fabulous experience" that was more "interesting" and "fun" than the stationary condition and that offered more variety in content due to the movement of the car.

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:15

A third of participants appreciated the fact that the VR experience could provide an entertaining distraction from an otherwise boring ride. Still others (4/15), however, found the simulation dull after a while, suggesting that watching a movie in VR might be more engaging. Half of participants (7/15) did like the stationary condition too, finding that it was more "comfortable", "relaxing", and enabled more ability to look around and observe their surrounding simulated environment with less risk of inducing motion sickness.

*Motion Sickness: When asked what can be improved, some people commented on the motion sickness issue* and made suggestions as to how changes to both the content as well as duration of the simulation could help. Regarding content, participants noted that the proximity of content made a difference, pointing out that they felt more sick when objects in the virtual world got too close. They also felt that the shorter course was less susceptible to producing feelings of nausea compared to the long course.

*Social Dynamics: Some participants also pointed out the need for such a VR system to consider in-car social* dynamics, as it might cause awkward or isolating experiences for the driver as currently deployed (e.g., "I enjoyed *it; but think as a passenger, I would not use it since it would be rude to the driver."). Several pointed out that an* autonomous setup could be most conducive.

## 6 Discussion and Future Work

We now summarize our key findings and provide a discussion of challenges and promising strategies to implement a calming/mindful VR experience in an automobile.

### 6.1 Key Findings

*6.1.1 Calming Effect of Movement. The primary finding of this study is to have shown an interaction effect* between car movement and VR movement on motion sickness. While we expected both congruent conditions to be capable of reducing arousal, we discovered that the main treatment (the Moving Car+Dynamic VR condition) was more successful in calming participants than the Stationary Car+Static VR condition and even further effective than using the VR system in a parked car. These findings motivate the continued pursuit of research that explores the possibilities for in-car VR interventions that have positive mind and body impacts, with minimal side effects. Commonplace drives, for instance as part of a typical commute for passengers in traditional or someday autonomous setups, offer a compelling opportunity to deliver soothing experiences on a regular basis. *6.1.2 Trade-offs Between Engagement and Motion Sickness. Another important finding of this study is the* relatively low occurrence of motion sickness we observed throughout our experiment. Nevertheless, an interaction effect of the SSQ reveals that motion sickness could be exacerbated by combining a moving car and dynamic VR content. Since no individual differences were observed, it is difficult to estimate whether congruent or incongruent combinations may be more susceptible to discomfort. Gonzalez-Franco and Lanier [20] and Akiduki et al. [1] propose that a discordant set of sensorial inputs can be a cause for simulator sickness. This, combined with the interaction effects we observed for head movement, suggest that users who feel more immersed - and consequently actively look around to explore stimuli in a virtual scene with which they are highly engaged - could potentially experience motion sickness due to this increased head movement. Further research is therefore worthwhile to determine optimal engagement levels with respect to individual proneness to motion sickness, including to define an upper threshold of "over-engagement". *6.1.3 Intervention Duration. The fact that no participants requested to stop the experiment during the 15 minute* endurance test is also highly encouraging and again indicates that any sickness induced by our system was relatively mild. Considering that a one-way commute by car takes approximately 25 minutes on average in the U.S. [57], this result again suggests that passenger-based commuting could be a fitting application context for

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:16 • P. Paredes et al.

mindful VR interventions. Along these lines, a desirable next step would be to more deeply investigate the effects of time in various VR scenarios, particularly to define an optimal range and limit for the duration of an in-car VR intervention that achieves (clinically and personally) meaningful levels of calm, mindfulness, and other positive psycho-physiological states before the onset of boredom, fatigue, or physical discomfort.

### 6.2 Challenges and Opportunities

There are a number of additional opportunities for building on our work as well, including to address present limitations.

To begin, we conducted an experiment that was small-scale, in part due to the significant setup, calibration, time, and other effort costs required to run each participant, though more-so because our goal was to undertake an exploratory study - including extensive piloting to investigate the viability, merit, and appropriate parameters for using VR in a moving vehicle to evoke a calming, comfortable experience. Going forward, it will be important to undertake larger-scale studies to replicate and expand our foundational findings in this area. For instance, while our experiment compared treatments against a resting baseline, as described, during which time participants did not engage in any activities, future studies could incorporate additional control conditions such as watching a movie, as suggested by some participants. Further, we observed a diverse range of reactions and preferences to the experience of VR; and while our participants represented a wide range of ages and prior experiences with respect to cars, mindfulness, and VR, it will be worthwhile to engage with broader samples that enable deeper exploration of individual differences.

Next, a limitation of our study is that our static and dynamic VR conditions use two different simulation applications (an island and an ocean, respectively) rather than using a consistent setting or using separate factors for VR movement and VR setting. As explained in section 4.1, we did this because piloting showed that innate qualities of each setting more intuitively fit with one movement condition than the other (i.e., fixed earth, flowing water) and that this combination also avoided discomfort induced by other movement-setting pairings. From a user experience perspective, we therefore opted for testing only the static-island and dynamic-ocean conditions of our VR movement experience variable; and we did attempt to minimize the potential confounding effects of setting by choosing thematically similar content. From a formal experimental design perspective, however, it would be desirable for future work to design intuitive and comfortable VR content that would enable the effects of VR movement and VR setting to be tested independently.

Another key decision we made during the design of this study was the choice of head mounted display (HMD). At the time, the Oculus Rift was the only potentially suitable PC-powered VR HMD available on the market. The HTC Vive was also available but required base stations that contain moving parts, which could be damaged if deployed while in motion. The Oculus Rift, on the other hand, which used infrared (IR) sensors both to improve rotational head tracking (i.e., to correct for the drift suffered by the gyroscope) and to enable positional tracking, did not contain moving parts and could be fixed inside a car. However, when we tested these sensors in the car, we determined that they actually generated more discomfort as a result of the car's motion, which led to lagged and jerky corrections. This was partially due to the fact that the system assumes congruence between the HMD IMU and the Oculus Rift sensors, which was not true for our study because the HMD IMU registers movement if the car rotates, but the Oculus Rift sensors (which are fixed to the car) would not register that same movement. As a result of these limitations, we opted for the Oculus Rift DK2, a PC-powered HMD that did not require an external tracking accessory (though plugging in the IR camera was necessary to start the applications). Consequently, this setup does not support translational head movements, but that was not essential to this study, as subjects were always seated and thus were mostly confined to rotational movements anyway. A related issue is that because we captured rotation only from the headset, we would not have been able to programmatically differentiate rotation from the car from rotation from the head. Instead, we used post-hoc video analysis to measure head

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:17 movement, but a more precise, programmatic measurement could have entailed attaching an IMU to the vehicle to differentiate between car rotation and head rotation. Follow-up studies (e.g., to precisely test whether the head moving one way and the body the other is a source of sickness) will be well-served to incorporate a reference point from the car in order to separate these signals and test such sources of incongruence. Furthermore, the decision to use a higher quality PC-powered HMD instead of a mobile HMD required the use of a gaming laptop as well as a large external power supply. We switched from a 400W 12V battery to a 1000W 12V deep-cycle battery after seeing that the former was only capable of powering the laptop (which was running and recording the VR footage) for the duration of one and a half to two back-to-back participants. The larger power supply alleviated this constraint and the need to constantly swap them in and out of the car between participants. However, the unit itself was extremely heavy and quite bulky (approximately 10kg, 10"x14"x14"), and it had a rather noisy internal fan. We look forward to the future development of untethered HMDs that close the gap on rendering and tracking quality such that a cumbersome PC-and-battery setup will no longer be necessary nor computationally advantageous. This would alleviate many logistical and operational challenges for mobile and ubiquitous studies working with high quality interactive VR experiences. In addition, ongoing developments in inside-out tracking can result in HMDs capable of positional (not just rotational) tracking without the use of external sensors or cameras. Such developments would realize a full-fledged, 6 degree-of-freedom HMD that will be truly standalone. Finally, as much as we focused on the passenger, it is important that future research also reports the potential impacts on the driver. A number of open research questions exist here that require future examination. For example, would in-car VR systems make a driver feel awkward, excluded, or resentful? More dangerously, can such systems be distracting, particularly if a passenger is continually and perhaps suddenly reacting to virtual content to which the driver is not privy? Overall, such work is important to ensure that positive passenger experiences do not come at the expense of the driver's well-being.

### 6.3 Design Recommendations

Based on our findings and drawing on our experiences implementing and evaluating our system, we identify the following implications for technology aimed at delivering calming and mindful VR experiences in a moving vehicle.

*6.3.1 Balancing Existing and New Content. Prototyping mindful VR experiences requires a degree of sophistication* even early on, during low fidelity design phases. We discuss considerations and trade-offs between employing *off-the-shelf and custom content.* Most content created for non-moving vehicles has limitations in virtual world size, and the typical focus on static scenes or layouts may be ill-matched with a more dynamic and expansive driving route. Porting existing content to the car is therefore not trivial, although it does represent a less laborious alternative to building new content from scratch. Plus, using existing high-end content for early prototyping shields users from the effects of poorly rendered content. Avoiding motion sickness or discomfort from low quality simulations is critical to supporting immersion, mindfulness, and overall experience.

For designers building custom content, we recommend incorporating the following specifications:

- Procedurally generated environments, possibly without borders. This prevents users from traveling off the world map, running into virtual walls, or winding up in positions that may be impossible to exit due to the movement of the car.
- Horizon-less scenes. This prevents users from potentially feeling the effects of non-volitional movement induced by the car.
- Minimal peripheral stimulation. In our study, we observed that some users who reported discomfort were also those who were quite curious about the fish or insects surrounding them in the ocean or on the island;

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:18 • P. Paredes et al.

their additional head movement to inquisitively attend to these simulated elements likely exacerbated motion discomfort.

- Focal areas in front of or above the user. Users who were constantly watching VR scenes taking place underneath them (e.g., a whale swimming below the user in the simulated environment) tended to report more discomfort and eventually some dizziness. While not a novel observation [45], these situations may be more likely to arise (and require deliberate design choices to avoid) when exploring or navigating a world in a moving vehicle.
- Physics reactions for all content entities. While swimming with the whales, some of our participants actually swam into a whale. Those who experienced this sometimes reported the encounter as "weird" or "gross". Again, these type of incidents are more likely to occur in a moving vehicle where users lack full control of translational or rotation movement. While building content that satisfies these guidelines may be too expensive for early prototypes, balancing existing and custom-made content should be considered as part of an overall system development strategy. *6.3.2 Using a High Frame Rate System. Our setup evolution from a standard integrated GPU card allowed us* to identify the value of a high frame rate VR setup to avoid inducing motion sickness effects. In contrast, the experiences of Hock et al. [27] and McGill et al. [34] with purely mobile systems (a smartphone in their cases) unfortunately faced poor performance that ultimately negatively impacted the overall experience for users. *6.3.3 Selecting Driving Segments with Minimal Acceleration Changes. During our piloting phase, participants* described feeling uncomfortable with sudden acceleration changes. If possible, we therefore see high value in applying in-car VR during segments of driving where few changes in acceleration are likely to take place. Highways or roads with few stop lights or slight turns would be preferable. *6.3.4 Aiming for Shorter Interventions. It is well known that the probability of motion sickness in a VR environ-* ment grows with the duration of exposure and diminishes with repeated exposure [30, 31]. Here, we again see the commute as an ideal scenario for creating multiple interventions (repeated exposure), each of short duration. These interventions could be experienced once or twice a day, every day. Furthermore, short calmness and mindfulness interventions are quite efficacious if performed repeatedly [29]. Overall, we therefore see little incentive to creating long interventions as opposed to a suite or a series of shorter, perhaps even micro-interventions, geared to make portions of one's commute or other driving experiences more immersive and mindful. *6.3.5 Leveraging Movement and Multi-Sensorial Inputs. As we show in our study, designing a calm or mindful* experience does not need to be static. While still-meditation is one of the most common forms of mindfulness nowadays, we have shown the effective use of non-volitional movement as a way to reduce arousal levels and promote mindfulness (and walking or other movement-based practices are gaining popularity). We encourage system builders to explore movement illusions generated not only by the entire car, but also by car components (e.g., the car seat). For example, synchronizing the movement of the car with the seat, while keeping the seat flat, could be used in a virtual environment to create a sensation of moving vertically (e.g., like a rocket to the moon). Furthermore, mixing movement with sound, temperature or air flow from the climate controls, or haptic stimulation could make the immersive experience even more realistic and immersive. Another advantage of applying VR in the car is that most of these multi-sensorial signals can be easily instrumented in modern vehicles.

## 7 Conclusion

In this paper, we described the development and evaluation of "Driving with the Fishes," our mindful in-car virtual reality (VR) intervention. We discovered that the use of calming VR content properly coupled with the movement of the car can lead to significantly lower levels of autonomic arousal. We further found that people can remain

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:19 engaged in the experience for relatively long stretches of time without motion sickness if the overall experience is well designed (e.g., to support high quality graphical rendering and full-body kinesthetic congruence). This is the first work showing that the marriage of two mainstream technologies, automobiles and VR, can be used to create mindful and relaxing experiences.

## Acknowledgments

Toyota Research Institute provided funds to assist the authors with their research, though this article solely reflects the opinions and conclusions of its authors and not Toyota Research Institute or any other Toyota entity. We thank the crew at the Center for Automotive Research at Stanford (CARS) for allowing us to use their facilities as well as the Stanford Center for Design Research (CDR) for their help during the early phases of design.

## References

[1] Hironori Akiduki, Suetaka Nishiike, Hiroshi Watanabe, Katsunori Matsuoka, Takeshi Kubo, and Noriaki Takeda. 2003. Visual-vestibular

conflict induced by virtual reality in humans. Neuroscience Letters 340, 3 (2003), 197-200. https://doi.org/10.1016/S0304-3940(03)00098-3 [2] Judith Amores and Pattie Maes. 2016. Influencing human behavior by means of subliminal stimuli using scent, light and brain computer

interfaces. In Proceedings ofthe 9th ACM International Conference on PErvasive Technologies Related to Assistive Environments. ACM, 62. [3] Judith Amores, Robert Richer, Nan Zhao, Pattie Maes, and Bjoern M Eskofier. 2018. Promoting Relaxation Using Virtual Reality, Olfactory

Interfaces and Wearable EEG. (2018). [4] Stephanie Balters, Elizabeth Murnane, James A. Landay, and Pablo E. Paredes. 2018. Breath Booster! Exploring In-Car, Fast-Paced

Breathing Interventions to Enhance Driver Arousal State. In Pervasive Health '18 - Proceedings ofthe 12th EAI International Conference on *Pervasive Computing Technologies for Healthcare.* [5] Frank Biocca and Ben Delaney. 1995. Immersive virtual reality technology. Communication in the age ofvirtual reality (1995), 57-124. [6] Nataly Birbeck, Shaun Lawson, Kellie Morrissey, Tim Rapley, and Patrick Olivier. 2017. Self Harmony: rethinking hackathons to design

and critique digital technologies for those affected by self-harm. In Proceedings ofthe 2017CHI Conference on Human Factors in Computing *Systems. ACM, 146-157.* [7] Olaf Blanke. 2012. Multisensory brain mechanisms of bodily self-consciousness. *Nature Reviews Neuroscience (2012).* https://doi.org/10.

1038/nrn3292 [8] Cristina Botella, Azucena Garcia-Palacios, Yolanda Vizcaíno, Rocio Herrero, Rosa Maria Baños, and Miguel Angel Belmonte. 2013.

Virtual reality in the treatment of fibromyalgia: a pilot study. *Cyberpsychology, Behavior, and Social Networking 16, 3 (2013), 215-223.* [9] Richard E. Boyatzis. 1998. Transforming qualitative information: Thematic analysis and code development. sage. [10] Kirk W. Brown and Richard M. Ryan. 2003. The benefits of being present: Mindfulness and its role in psychological well-being. Journal

*ofPersonality and Social Psychology 84, 4 (2003), 822-848.* https://doi.org/10.1037/0022-3514.84.4.822 [11] Grigore C. Burdea. 1999. Haptic Feedback for Virtual Reality. Virtual Reality and Prototyping Workshop 2,June (1999), 17-29. https:

//doi.org/10.1.1.135.6358 [12] Rafael A. Calvo and Dorian Peters. 2012. Positive computing: technology for a wiser world. *interactions (2012), 28-31.* https:

//doi.org/10.1145/2212877.2212886 [13] Carolina Cruz-Neira, Daniel J. Sandin, Thomas A. DeFanti, Robert V. Kenyon, and John C. Hart. 1992. The CAVE: audio visual experience

automatic virtual environment. Commun. ACM 35, 6 (1992), 64-72. https://doi.org/10.1145/129888.129892 [14] Char Davies and John Harrison. 1996. Osmose: towards broadening the aesthetics of virtual reality. ACM SIGGRAPH Computer Graphics

30, 4 (1996), 25-28. [15] Piotr Didyk, Elmar Eisemann, Tobias Ritschel, Karol Myszkowski, and Hans-Peter Seidel. 2010. Perceptually-motivated real-time

temporal upsampling of 3D content for high-refresh-rate displays. In Computer Graphics Forum, Vol. 29. Wiley Online Library, 713-722. [16] Johan Engström, Emma Johansson, and Joakim Östlund. 2005. Effects of visual and cognitive load in real and simulated motorway

driving. *Transportation research part F: traffic psychology and behaviour 8, 2 (2005), 97-120.* [17] Jesse Fox, Jeremy N. Bailenson, and Tony Ricciardi. 2012. Physiological responses to virtual selves and virtual others. *Journal of*

*CyberTherapy & Rehabilitation 5, 1 (2012), 69-73.* [18] Shaun Gallagher. 2000. Philosophical conceptions of the self: Implications for cognitive science. , 14-21 pages. https://doi.org/10.1016/

S1364-6613(99)01417-5 [19] David Goedicke, Jamy Li, Vanessa Evers, and Wendy Ju. 2018. VR-OOM: Virtual Reality On-rOad driving siMulation. In Proceedings of

*the 2018 CHI Conference on Human Factors in Computing Systems. ACM, 165.* [20] Mar Gonzalez-Franco and Jaron Lanier. 2017. Model of Illusions and Virtual Reality. *Frontiers in Psychology 8, June (2017), 1125.*

https://doi.org/10.3389/fpsyg.2017.01125

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

184:20 • P. Paredes et al.

[21] Diane Gromala, Xin Tong, Amber Choo, Mehdi Karamnejad, and Chris D Shaw. 2015. The virtual meditative walk: virtual reality

therapy for chronic pain management. In Proceedings ofthe 33rd Annual ACM Conference on Human Factors in Computing Systems. ACM, 521-524. [22] Paul Grossman, Ludger Niemann, Stefan Schmidt, and Harald Walach. 2004. Mindfulness-based stress reduction and health benefits: A

meta-analysis. Journal ofpsychosomatic research 57, 1 (2004), 35-43. [23] Patrick Haggard, Sam Clark, and Jeri Kalogeras. 2002. Voluntary action and conscious awareness. *Nature Neuroscience 5, 4 (2002),*

382-385. https://doi.org/10.1038/nn827 [24] Thich Nath Hahn. 1987. The Miracle ofMindfulness: An Introduction to the Practice ofMeditation. Boston. [25] Javier Hernandez, Pablo E. Paredes, Asta Roseway, and Mary Czerwinski. 2014. Under pressure: Sensing stress of computer users. In

*Conference on Human Factors in Computing Systems - Proceedings. 51-60.* https://doi.org/10.1145/2556288.2557165 [26] Klaus Hinkelmann and Oscar Kempthorne. 2007. Latin Square Type Designs. In Design and Analysis of Experiments, Volume 1 -

*Introduction to Experimental Design. 373-417.* https://doi.org/10.1002/9780470191750.ch10 [27] Philipp Hock, Sebastian Benedikter, Jan Gugenheimer, and Enrico Rukzio. 2017. CarVR. In Proceedings of the 2017 CHI Conference on

*Human Factors in Computing Systems - CHI '17. 4034-4044.* https://doi.org/10.1145/3025453.3025665 [28] James Hodge, Madeline Balaam, Sandra Hastings, and Kellie Morrissey. 2018. Exploring the Design of Tailored Virtual Reality Experiences

for People with Dementia. In Proceedings ofthe 2018 CHI Conference on Human Factors in Computing Systems. ACM, 514. [29] Jon Kabat-Zinn. 2003. Mindfulness-based interventions in context: Past, present, and future. , 144-156 pages. https://doi.org/10.1093/

clipsy/bpg016 [30] Robert S. Kennedy, Norman E. Lane, Kevin S. Berbaum, and Michael G. Lilienthal. 1993. Simulator Sickness Questionnaire: An

Enhanced Method for Quantifying Simulator Sickness. The International Journal of Aviation Psychology 3, 3 (1993), 203-220. https: //doi.org/10.1207/s15327108ijap0303{\_}3 [31] Robert S.Kennedy,Kay M. Stanney, and William P. Dunlap. 2000. Duration and Exposure to Virtual Environments: Sickness Curves During

and Across Sessions. Presence: Teleoperators and Virtual Environments 9, 5 (2000), 463-472. https://doi.org/10.1162/105474600566952 [32] Mark A. Lau, Scott R. Bishop, Zindel V. Segal, Tom Buis, Nicole D. Anderson, Linda Carlson, Shauna Shapiro, James Carmody, Susan

Abbey, and Gerald Devins. 2006. The toronto mindfulness scale: Development and validation. Journal of Clinical Psychology 62, 12 (2006), 1445-1467. https://doi.org/10.1002/jclp.20326 [33] Sara W. Lazar. 2005. Mindfulness Research. Mindfulness and psychotherapy 22 (2005), 220-238. [34] Mark McGill, Alexander Ng, and Stephen Brewster. 2017. I Am The Passenger: How Visual Motion Cues Can Influence Sickness

For In-Car VR. Proceedings of the 2017 CHI Conference on Human Factors in Computing Systems - CHI'17 (2017), 5655-5668. https: //doi.org/10.1145/3025453.3026046 [35] Michael Meehan. 2001. Physiological Reaction as an Objective Measure of Presence in Virtual Environments. Department ofComputer

*Science 62 (2001), 1465.* http://wwwx.cs.unc.edu/Research/eve/physio/downloads/TR01-018.pdf [36] Maria V. Nararro-Haro, Hunter G. Hoffman, Azucena Garcia-Palacios, Mariana Sampaio, Wadee Alhalabi, Karyn Hall, and Marsha

Linehan. 2016. The use of virtual reality to facilitate mindfulness skills training in dialectical behavioral therapy for borderline personality disorder: a case study. *Frontiers in psychology 7 (2016), 1573.* [37] Matthew K. X. J. Pan and Günter Niemeyer. 2017. Catching a real ball in virtual reality. In Virtual Reality (VR), 2017IEEE. IEEE, 269-270. [38] Pablo E. Paredes, Nur Al-Huda Hamdan, Dav Clark, Carrie Cai, Wendy Ju, and James A. Landay. 2017. Evaluating in-car movements

in the design of mindful commute interventions: Exploratory study. *Journal of Medical Internet Research 19, 12 (2017).* https: //doi.org/10.2196/jmir.6983 [39] Pablo E. Paredes, Ryuka Ko, Arezu Aghaseyedjavadi, John Chuang, John F. Canny, and Linda Babler. 2015. Synestouch: Haptic + audio

affective design for wearable devices. In 2015 International Conference on Affective Computing and Intelligent Interaction, ACII2015. https://doi.org/10.1109/ACII.2015.7344630 [40] Pablo E. Paredes, Francisco Ordonez, Wendy Ju, and James A. Landay. 2018. Fast & Furious: Detecting Stress with a Car Steering Wheel.

In CHI '18- Proceedings ofthe SIGCHI Conference on Human Factors in Computing Systems. 11. https://doi.org/10.1145/3173574.3174239 [41] Pablo E. Paredes, Ying Zhou, Nur Al-Huda Hamdan, Stephanie Balters, Elizabeth Murnane, Wendy Ju, and James A. Landay. 2018. Just Breathe : In-Car Interventions for Guided Slow Breathing. *Interactive, Mobile, Wearable and Ubiquitous Technologies (2018), 28.* https://doi.org/10.1145/3191760 [42] Lisa Rebenitsch and Charles Owen. 2014. Individual Variation in Susceptibility to Cybersickness. Proceedings ofthe 27th annual ACM

*symposium on User interface software and technology (2014), 309-317.* https://doi.org/10.1145/2642918.2647394 [43] Diane K. Reibel, Jeffrey M. Greeson, George C. Brainard, and Steven Rosenzweig. 2001. Mindfulness-based stress reduction and

health-related quality of life in a heterogeneous patient population. General hospital psychiatry 23, 4 (2001), 183-192. [44] Jonathan W. Roberti, Lisa N. Harrington, and Eric A. Storch. 2006. Further Psychometric Support for the 10-Item Version of the Perceived

Stress Scale. *Journal ofCollege Counseling 9 (2006), 135-147.* https://doi.org/10.1002/j.2161-1882.2006.tb00100.x [45] Roy A. Ruddle. 2004. The effect of environment characteristics and user interaction on levels of virtual environment sickness. In

*Proceedings - Virtual Reality Annual International Symposium. 141-148.* https://doi.org/10.1109/VR.2004.1310067

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.

Driving with the Fishes: Towards Calming and Mindful Virtual Reality Experiences for the Car • 184:21

[46] Diego C. Ruspini, Krasimir Kolarov, and Oussama Khatib. 1997. The haptic display of complex graphical environments. Proceedings of

*the 24th annual conference on Computer graphics and interactive techniques (1997), 345-352.* https://doi.org/10.1145/258734.258878 [47] James A. Russell. 1980. A circumplex model of affect. , 1161-1178 pages. https://doi.org/10.1037/h0077714 [48] Christopher D. Shaw, Diane Gromala, and A. Fleming Seay. 2007. The meditation chamber: Enacting autonomic senses. *Proc. of*

*ENACTIVE/07 (2007).* [49] Six Flags. [n. d.]. VR Coaster. https://www.sixflags.com/newengland/attractions/vr/overview [50] Mel Slater, Martin Usoh, and Anthony Steed. 1995. Taking steps: the influence of a walking technique on presence in virtual reality.

*ACM Transactions on Computer-Human Interaction 2, 3 (1995), 201-219.* https://doi.org/10.1145/210079.210084 [51] Misha Sra and Chris Schmandt. 2016. Bringing real objects, spaces, actions, and interactions into social VR. In Collaborative Virtual

*Environments (3DCVE), 2016 IEEE Third VR International Workshop on. IEEE, 16-17.* [52] Barry E. Stein and Terrence R. Stanford. 2008. Multisensory integration: current issues from the perspective of the single neuron. Nature

*Reviews Neuroscience 9, 4 (2008), 255-266.* https://doi.org/10.1038/nrn2331 [53] David Sun, Pablo E. Paredes, and John F. Canny. 2014. MouStress: Detecting Stress from Mouse Motion. CHI'14- Proceedings of the

*SIGCHI Conference on Human Factors in Computing Systems (2014), 61-70.* https://doi.org/10.1145/2556288.2557243 [54] Thera and Nyanaponika. 2001. The Power ofMindfulness. [55] Anja Thieme, Jayne Wallace, Paula Johnson, John McCarthy, Siân Lindley, Peter Wright, Patrick Olivier, and Thomas D Meyer. 2013.

Design to promote mindfulness practice and sense of self for vulnerable women in secure hospital services. Proceedings ofthe SIGCHI *Conference on Human Factors in Computing Systems, 2647-2656.* [56] Mark Turner and Michael J. Griffin. 1999. Motion sickness in public road transport: The effect of driver, route and vehicle. Ergonomics

42, 12 (1999), 1646-1664. https://doi.org/10.1080/001401399184730 [57] U.S. Census Bureau. 2009. Commuting in the United States: 2009. https://www.census.gov/prod/2011pubs/acs-15.pdf [58] U.S. Census Bureau. 2017. 2012-2016 American Community Survey. [59] Jay Vidyarthi, Bernhard E Riecke, and Diane Gromala. 2012. Sonic Cradle: designing for an immersive experience of meditation by

connecting respiration to music. In Proceedings ofthe designing interactive systems conference. ACM, 408-417. [60] Yasuyoshi Yokokohji, Ralph L Hollis, and Takeho Kanade. 1996. What You Can See is What You Can Feel - Development of a Visual/Haptic

Interface to Virtual Environment. Proceedings ofthe IEEE 1996 Virtual Reality Annual International Symposium (1996), 46-53.

Received May 2018; revised August 2018; accepted October 2018

Proc. ACM Interact. Mob. Wearable Ubiquitous Technol., Vol. 2, No. 4, Article 184. Publication date: December 2018.
