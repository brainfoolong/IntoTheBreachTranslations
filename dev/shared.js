'use strict'
const fs = require('fs')

const shared = {
  'config': require(__dirname + '/config'),
  'translationFiles': ['scripts/text.lua', 'scripts/text_achievements.lua', 'scripts/text_tooltips.lua', 'scripts/text_population.lua', 'scripts/text_weapons.lua'],
  'contexts': {
    'TILE_TOOLTIPS = {': 'TILE_TOOLTIPS',
    'local STATUS_TOOLTIPS = {': 'STATUS_TOOLTIPS',
    'local PilotSkills = {': 'PilotSkills',
    'local PopEvent = {': 'PopEvent',
    'Achievement_Texts = {': 'Achievement_Texts',
    'local Global_Texts = {': 'Global_Texts',
    'Weapon_Texts = {': 'Weapon_Texts'
  },
  'additionalTranslations': [
    ['Kill 4 enemies inflicted with A.C.I.D.', '"%s'],
    ['Kill 4 enemies inflicted\\nwith A.C.I.D.', '"%s'],
    ['killed so far', '%s\\)"'],
    ['killed', '%s\\)"'],
    ['A.C.I.D. Tank', '"%s"'],
    null,
    null,
    ['Destroy the A.C.I.D. Vats', '"%s"'],
    ['Destroy the Vats', '"%s"'],
    ['Remain', '"%s"'],
    ['Conveyors', '"%s"'],
    ['Conveyor Belts will push any unit on them in the marked direction at the start of the enemy turn.', '"%s"'],
    ['CONVEYOR BELTS', '"%s"'],
    ['CONVEYORS', '"%s"'],
    ['Defend the Disposal Unit', '"%s"'],
    ['Destroy all mountains', '"%s"'],
    ['Mountains', '"%s"'],
    ['Disposal', '"%s"'],
    ['A.C.I.D. Launcher', '"%s"'],
    ['Partial', '"%s"'],
    ['Air Support', '"%s"'],
    ['Bombs will be dropped on the marked spaces, killing any unit.', '"%s"'],
    ['AIR SUPPORT', '"%s"'],
    ['Destroy the Beetle Leader', '"%s"'],
    ['Destroy the Bot Leader', '"%s"'],
    ['Destroy the Firefly Leader', '"%s"'],
    ['Destroy 5 Goos', '"%s"'],
    ['Destroy', '"%s *"'],
    ['Large Goo', '"%s"'],
    ['Medium Goo', '"%s"'],
    ['Small Goo', '"%s"'],
    ['Destroy the Hornet Leader', '"%s"'],
    ['Hornet Leader', '"%s"'],
    ['Destroy the Psion Abomination', '"%s"'],
    ['Psion Abomination', '"%s"'],
    ['Destroy the Scorpion Leader', '"%s"'],
    ['Scorpion Leader', '"%s"'],
    ['Destroy the Slug Leader', '"%s"'],
    ['Hive Leader', '"%s"'],
    ['Slugling Egg', '"%s"'],
    ['Destroy the Spider Leader', '"%s"'],
    ['Spider Leader', '"%s"'],
    ['Spiderling Egg', '"%s"'],
    ['Caverns', '"%s"'],
    ['Watch out for falling rocks and lava!', '"%s"'],
    ['Volcano', '"%s"'],
    ['Watch out for the active volcano!', '"%s"'],
    ['VOLCANO', '"%s"'],
    ['Survive the Fight', '"%s"'],
    ['Defend the Renfield Bomb until it explodes', '"%s"'],
    ['Renfield Bomb', '"%s"'],
    ['Defend the Artillery Support', '"%s"'],
    ['Defend the Artillery Unit', '"%s"'],
    ['Old Artillery', '"%s"'],
    ['Destroy the dam', '"%s"'],
    ['Old Earth Dam', '"%s"'],
    ['Defend the Satellite Launches', '"%s *"'],
    ['(One Lost)', '"%s"'],
    ['Defend the 1st satellite launch', '"%s"'],
    ['Defend the 2nd satellite launch', '"%s"'],
    ['Satellite Rocket', '"%s"'],
    ['Defend the Tanks', '"%s'],
    ['Defend Archive Inc. Tanks (One Lost)', '"%s"'],
    ['undamaged', '%s\\)"'],
    ['Archive Tank', '"%s"'],
    ['Archive Inc \\nOld Earth Tank', '"%s"'],
    ['High Tides', '"%s"'],
    ['Marked tiles will turn to water at the start of the enemy turn.', '"%s"'],
    ['TIDAL WAVES', '"%s"'],
    ['Defend the Prototype Renfield Bombs', '"%s *"'],
    ['Defend the Bombs', '"%s(\\n)*"'],
    ['Prototype Bomb', '"%s"'],
    ['Cataclysmic Earthquakes', '"%s"'],
    ['Marked tiles will become Chasms at the start of the enemy turn, killing any ground units present.', '"%s"'],
    ['CATACLYSM', '"%s"'],
    ['Seismic Activityo', '"%s"'],
    ['Marked squares will sink into the earth, killing anything on them.', '"%s"'],
    ['Defend the Earth Mover', '"%s"'],
    ['Earth Mover', '"%s"'],
    ['Destroy 2 mountains', '"%s"'],
    ['Destroy 2 mountains \\n(Current: ', '"%s"'],
    ['Sinkhole Hive', '"%s"'],
    ['Lightning Storm', '"%s"'],
    ['Lightning will strike four spaces every turn, killing any unit on the marked tiles.', '"%s"'],
    ['LIGHTNING STORM', '"%s"'],
    ['LIGHTNING', '"%s"'],
    ['Sandstorm', '"%s"'],
    ['All DUNES will turn to SMOKE, all SMOKE will be removed.', '"%s"'],
    ['SANDSTORM', '"%s"'],
    ['Defend the Terraformer', '"%s"'],
    ['Terraform the grassland back to desert', '"%s"'],
    ['Area Blast', '"%s"'],
    ['Self-Destruct, damaging neighboring tiles.', '"%s"'],
    ['Defend the Robots', '"%s *"'],
    ['Defend the remaining Robot', '"%s"'],
    ['Robot Factories', '"%s"'],
    ['Robot Factory', '"%s"'],
    ['Defend both Robot Factories', '"%s"'],
    ['damaged', '%s\\)"'],
    ['Break 5 buildings out of the ice', '"%s'],
    ['Break 5 buildings out\\nof the ice', '"%s'],
    ['Freeze and defend both robots', '"%s"'],
    ['Freeze and defend the robots (one frozen)', '"%s"'],
    ['Freeze and defend \\nboth robots', '"%s"'],
    ['Freeze and defend the remaining robot', '"%s"'],
    ['Ice Storm', '"%s"'],
    ['Marked tiles will be frozen at the start of the enemy turn.', '"%s"'],
    ['ICE STORM', '"%s"'],
    ['Freeze Tank', '"%s"'],
    ['Freeze Cannon', '"%s"'],
    ['Shoot a projectile that freezes targets', '"%s"'],
    ['Solar Farm', '"%s"'],
    ['Solar Farms', '"%s"'],
    ['Defend both Solar Farms', '"%s"'],
    ['Defend both Wind Farms', '"%s"'],
    ['Defend both Power Plants', '"%s"'],
    ['Your bonus objective', '"%s *"'],
    ['to defend this structure', ' *%s("|\.)'],
    ['Defend the train', '"%s'],
    ['Defend the damaged train', '"%s"'],
    ['The train is damaged and will no longer move', '"%s"'],
    ['If the train is blocked when moving, it will explode', '"%s"'],
    ['It is too damaged to continue. Defend it.', '"%s"'],
    ['Supply Train', '"%s"'],
    ['Damaged Train', '"%s"'],
    ['Move forward 2 spaces, but will be destroyed if blocked.', '"%s"'],
    ['Kill all enemies before they retreat', '"%s"'],
    ['Kill all enemies before \\nthey retreat', '"%s"'],
    ['Do not kill the Volatile Vek', '"%s"'],
    ['Don\'t let the Volatile \\nVek die', '"%s"'],
    ['Volatile Vek', '"%s"'],
    ['This is a CEO mission briefing message. It is very atmospheric and exciting, giving you a closer look at the world and the mission you\'re about to engage in.', '"%s"'],
    ['This is a CEO mission closing message. It reflects on how well the mission just went. It has glowing praise, or possibly it\'s rather insulting of your skills.', '"%s"'],
    ['Kill all enemies before \\nthey retreat', '"%s"'],
    ['Less than 3 Grid Damage', '"%s'],
    ['End with less than 4 Mech Damage', '"%s'],
    ['Block Vek Spawning 3 times', '"%s'],
    ['Block Vek Spawning\\n3 times', '"%s'],
    ['Kill at least', '"%s *"'],
    ['Protect the', '"%s *"'],
    ['Do not kill the Volatile Vek', '"%s"'],
    ['Take less than 3 Grid Damage', '"%s"'],
    ['End battle with less than 4 Mech Damage', '"%s"'],
    ['Block Vek Spawning 3 times', '"%s"'],
    ['Enemies', '" *%s[\\\\ n]*"'],
    ['Your bonus objective', '"%s'],
    ['to defend this structure.', '%s"'],
    ['You withdrew from the battlefield, leaving supplies and civilians behind.', '"%s"'],
    ['All of your mechs have been disabled. An evacuation team will arrive shortly to recover your pilots and their wreckage.', '"%s"'],
    ['Current Damage:', '%s'],
    ['Current:', '%s'],
    ['Robotics Lab', '"%s"'],
    ['Old Earth Bar', '"%s"'],
    ['Corporate Tower', '"%s"'],
    ['Defense Lab', '"%s"'],
    ['Shield Generator', '"%s"'],
    ['Power Generator', '"%s"'],
    ['Emergency Batteries', '"%s"'],
    ['Airfield', '"%s"'],
    ['Rift Walkers', '"%s"'],
    ['Rusting Hulks', '"%s"'],
    ['Zenith Guard', '"%s"'],
    ['Steel Judoka', '"%s"'],
    ['Flame Behemoths', '"%s"'],
    ['Frozen Titans', '"%s"'],
    ['Hazardous Mechs', '"%s"'],
    ['Secret Squad', '"%s"'],
    ['Earn VAL or more Corporate Reputation.', '"%s"'],
    ['Lose VAL or less total Grid Power.', '"%s"'],
    ['Take VAL or less total Mech Damage', '"%s"'],
    ['Don\'t fail any Bonus Objective.', '"%s"'],
    ['Earn VAL Grid Power or more.', '"%s"'],
  ],
  'pilotsTranslation': [
    'See below, this is the entry for a generic (A.I.) pilot.',
    'See below, this is the entry for a generic Archive pilot.',
    'See below, this is the entry for a generic R.S.T. pilot.',
    'See below, this is the entry for a generic Pinnacle (A.I.) pilot.',
    'See below, this is the entry for a generic Detritus pilot',
    'Ralph Karlsson [Unknown] Ralph has crossed the breach almost more times he can count - there\'s been at least a hundred timelines he\'s watched fall (in the opening state, he has yet to save even one). This continuous cycle of warfare has made him ruthlessly efficient, being unwilling to even sleep if he has to, as he feels every second counts... and every second that slips away could be the critical moment lost to the Vek. He\'s come a long way from the wide-eyed soldier he first was (it seems like several lifetimes ago, and it was), and he tries to avoid attachments to the other pilots, as he knows how likely they are to die in battle. He has never said which island he hails from, and there are suspicions he may have come from somewhere beyond the Corporate archipelago... possibly even from a space station. If true, Ralph has refused to confirm it, although in a few timelines, both Bethany, Harold, and Isaac have commented on the Time Pod\'s architecture as being modeled off of space-faring tech (notably a launch capsule of a rocket... or an escape pod of a rocket).',
    'Bethany Jones [Pinnacle] Bethany Jones served as a physics engineer at Pinnacle, helping design and refine Pinnacle shield technology. Having only grown up on Pinnacle, she\'s somewhat sheltered with regards to the other islands, and she tends to trusting of others, taking them at their word. She loves the cold and the snow, but she\'s also excited by the opportunities to see other islands in the Corporate archipelago and learn from the people there. While she and Isaac are technically brother and sister, there hasn\'t been a timeline where they both were alive to realize this (either Bethany dies at a young age, or Isaac dies - only one of them could be saved in the womb b/c of a chronic medical condition their parents had). Bethany has had a more positive upbringing than Isaac, and her genius is tempered more with empathy and optimism than Isaac (who had a much more difficult childhood).',
    'Abe Isamu [R.S.T.] Sometimes jokingly called ""Honest Abe"" in previous timelines, nothing could be farther from the truth. Abe served as an ""expeditor"" (assassin and ""black box"" work) during the early years of CEO Kern\'s rise to power, and he took on many names and identities in service to R.S.T. to handle any ""difficult issues"" that would arise that needed to be dealt with by the corporation. He is ruthless when given an objective (in this case, fighting the Vek), and served as ground support in his original timeline before stealing a Mech from a dying (?) pilot and using its breach technology to escape the timeline after the squad perished in the volcanic island. Since then, ""Abe"" has followed the orders of his first CEO Kern and is determined to keep fighting until every Vek in every timeline is defeated... a hopeless task, but ""Abe"" realizes he has little else to fight for, and even if he were to remain in a timeline he saved, he could not deal with the idea that other timelines were still in jeopardy. He has yet to encounter his duplicate, and if so, he may not recognize them due to surgery and the fluctuation of identities his job required before the Vek attack.',
    'Harold Schmidt [Archive] Harold is as close as they come to an engineering ""sociopath"" (this is not the clinical term - co-workers in previous timelines used to call him a ""technopath,"" but even that\'s not an accurate term for his lack of empathy and social skills). He finds humans uncomfortable and confusing, and takes solace in tinkering with robotics and machines who have clear rulesets and reasons for what they do. In his original timeline, he served a brief term at Detritus (where he seemed bored and uncommunicative), then was rejected from Pinnacle due to his psychological exam, then found a home in Archive, studying and doing restoration work on Old Earth robotics. He initially applied to Archive\'s open-call for pilot training so it could get him closer to the Mech technology, then it was discovered he did well on the pilot exam (better than most Archive volunteers), and he agreed to serve as a soldier as a way of giving him access to the cutting edge of Mech technology. (Note that Harold doesn\'t bear any ill-will toward Detritus and Pinnacle, nor do they bear him any ill-will... however, both Singh\'s predecessor and Zenith saw Harold\'s lack of empathy, and were worried it could lead to accidents or disregard for human life while he was carrying out his duties.)',
    'Prospero [Detritus] In its original timeline, Prospero was a recycler robot from Detritus. Its job was to monitor region safety in Detritus disposal sites, but was severely damaged in a disposal accident (this was in the days before Vikram was CEO). The ""recycled recycler"" robot was sold at a discount to Archive as a groundskeeper for some of the nature preserves, and it seemed to take to the work, translating its knowledge of chemistry and recycling technology to help cultivate gardens (and when it wasn\'t able to do this, it would devour all books on botany, biology, and even spiritual books related to nurturing and growing of all life forms). It would have likely have remained a quiet hulking gardener were it not for the emergence of the Vek. When the Vek erupted on Archive, the robot followed its directives to protect the nature preserves… and saw the Vek as nothing more than garden pests to be eliminated to protect the plants. When Archive was able to send reinforcements to the region, they found Prospero still quietly tending its garden, now fertilized with Vek corpses.',
    'Note that given the recent rise in prejudice against the Pinnacle robots, Gana has suffered similar discrimination… and several officers have questioned if Gana\'s ""sanity"" in case he may malfunction like the Pinnacle robots.',
    'Isaac [Pinnacle] Isaac has seen too many timelines collapse, and seen too many permutations for how things can go wrong - his high intelligence actually works against him, rather than makes him more confident because he can imagine all the ways things can go wrong (think Chidi Anagonye in The Good Place). He feels ill-suited for being a soldier (his squad mates usually agree, but his scientific knowledge is indispensable).',
    'While he and Bethany are technically brother and sister, there hasn\'t been a timeline where they both were alive to realize this (either Bethany dies at a young age, or Isaac dies - only one of them could be saved in the womb b/c of a chronic medical condition their parents had). He respects machines and sees them as equals due to being raised on Pinnacle (he has faith in Zenith, perhaps too much as he feels she\'s too intelligent to do anything wrong).',
    'Isaac is as much of a genius as his sister, although self-doubt weakens him. He has considerable knowledge of aeronautics, physics, gravitation theory and manipulation, and a number of other fields. It is likely Isaac could master any science he chose to, his only block is his own perceived limitations.',
    'Silica [R.S.T.] Silica is a hybrid of Pinnacle and R.S.T. technology, believed to be one of the first (and possibly only) artificial intelligences devoted to terrain architecture.',
    'In ""his"" original timeline, Silica was responsible for first detecting and studying the Vek, and eventually was modified to investigate their hives... this nearly ended catastrophically, and Silica was recovered and his programming altered from terraforming to terraforming-based-combat... the concept of using the existing terrain and shaping it, exploiting it, and using the surrounding region as a weapon against the Vek.',
    'When Silica jumped timelines, his original programming was unknown to every subsequent timeline, and they have seen him only in his role as a environmental tactician, designed to help the islands defeat the Vek.","Archimedes [Pinnacle] Archimedes is a cutting-edge robotic intelligence (a Sentient, he finds the term ""robot"" and ""artificial"" to be discriminatory) from Pinnacle designed to act as a Human Relations officer. It has come from a timeline where Pinnacle ""oversaw"" the islands (the Pinnacle Island Network: P.I.N.) and tended to the humans\' needs (much like how you would take care of animals on a farm, but not in a mean or ruthless way – the Sentients simply saw themselves as benevolent caretakers to keep the humans from hurting themselves).',
    'Zenith has refused to allow Archimedes access to her network, for fear that his directives may corrupt programming on Pinnacle (if this occurred it would be inadvertent, but it is a possibility). Archimedes believes the rioting behavior of the robots on Pinnacle is due to either (1) a contradictory directive they are attempting to follow or reconcile, or (2) the possibility that the arrival of sentient pilot variants from other timelines may indeed be interfering with the natural programmatic order on the island.',
    'The Mantis are an alien race from the game FTL. Generic text is used to streamline these pilots for use in the game. Kazaaakpleth is a secret pilot that can be gained over the course of the game.',
    'General Background: The Mantis exist to expand, loot, and plunder. There are males and females of the species. They once enslaved the Engi (and thus, may have an overseer-like dominance toward their Mech). They are expansionist, tribal, warlike, and polytheistic. Females often don\'t make it to high positions of authority unless they are particularly vicious.',
    'The Mantis at key points in their life, have to either return home to reform their exoskeletons (non-biological materials adhere to a resin secreted by their epidermal layers) - or to a suitable planet with the same materials. The Earth of Into the Breach is one such planet although it\'s not clear if the Mantis were aware of that. Their ships are also composed of the same crust as the Mantis ""wear."" Presumably this crust can be applied to Mech hulls as well (not planning to discuss/show in game, merely commenting this). Mantis ship hulls may also be bedecked with hides, corpses, and remains of their kills. The Mantis enjoy teleporter technology in hunting prey (teleporting onto ships) and are comfortable with the technology (but the Breach tech may be more primitive than they\'re used to).',
    'Specific Background: Kazaaakpleth is feared among his own people because he doesn\'t hunt aliens... he prefers to hunt his own kind. He outwardly claims to be doing this for bounties and for a higher, noble purpose, but secretly, he enjoys killing other Mantis. His craft is an escape pod from a failed encounter with a tribe of his own people he\'d marked for death. His craft detected the beacon from Earth, and followed it to the corporate islands. He soon relalized he\'d come to the ""Happy Hunting Grounds"" a place where he can practice his fighting skills on larger varities of insects than ever (the Vek) and a machine (his Mech) that he can use as a weapon. Kazaaakpleth is happy to slay as many Vek as he can, although if he had the skill to build a ship and take to the stars with the technology he has found, he would do so. Like Mantis, do, K. needs to reestablish his carapace, and he finds the islands rich with suitable biological material - including Vek corpses.',
    'The Zoltan are an alien race from the game FTL. Generic text is used to streamline these pilots for use in the game. Mafan is a secret pilot that can be gained over the course of the game.',
    'General Background: The Zoltan are a wise, intelligent species of energy, about to transcend to a higher ""level"" – of consciousness. They favor enlightenment above all else. They are respectful, tactful, and humble… but not pushovers if attacked. Younger members (""children"") in the lore are said to be gaining telepathic powers.',
    'Specific Background: Mafan was on a pilgrimage when the beacon summoned it. It finds the idea of the breaches to be akin to enlightenment along the lines of Groundhog Day although it finds them surprising… it considers the two week ""recycling"" of the self an opportunity to reflect on one\'s actions forever within an enclosed temporal loop. It considers the Vek to be an obstruction to this enlightenment, but also a necessary part of the phenomenon that keeps sparking the breaches to be made. (More specifics about the tone and intent of each of the lines below can be found in the Writing Style Guide, broken down line by line, if curious – it gives more information on how Mafan and the Zoltan might perceive certain events.)',
    'The Rock (People) are an alien race from the game FTL. Generic text is used to streamline these pilots for use in the game. Ariadne is a secret pilot that can be gained over the course of the game',
    'General Background: Rock (people, male and females of the species exist) are large, herbivorous bipeds. Rock(men) are natural isolationists and like to be left alone. They are dogmatic and single-minded. In their own territories, they are largely religious zealots and have a wide interpretation of cultural transgression (ex: offers to trade can be interpreted as hostile). Rock(men) are raised so that radical members of their species are separated from the population and carefully managed so that they can fit in with the rest of their culture. Interaction with alien species is illegal. Their home culture involve arranged marriages. They were one of the founders of the Federation (along with humans and Engi).',
    'Rockmen who do not conform to their species stereotype (say, rebelling against religion or by being simply... different) can be found amongst the stars, and several instances of Rock pirates and warriors exist in the Big Black (they are known to cover their ships with ""outcast decorations"").',
    'Specific Background: Ariadne (female of the species) was fleeing a pre-arranged marriage to a Basilisk Chief (see FTL) when the beacon diverted her vessel. Her crime prevents her from wanting to return to Rock space even if she could... but is uncomfortable amongst the many cultures on the new planet she has found. She is vaguely curious what time travel/breach technology could possibly do to erase her crime and the events leading up to it, allowing for a fresh start.',
    'Artificial pilots are assigned to mechs as a last resort in combat. While they are capable of fighting, Mechs excel and become better when manned by a human pilot (or Pinnacle A.I., which are far more advanced). Artificial pilots are often present in the corporate islands, but not accorded the same status nor have the same extent of personality that the Pinnacle robots do.',
    'These fellows are a little uncertain, but interested in the Mechs they are commanding from an Archive point of view.',
    'R.S.T. pilots are no-nonsense and share much of Kerns\' aggressive pragmatism. They tend to be harsher than the other Island pilots and have a ruthless streak. Sometimes stiff and military (""commander""), but at other times, their eagerness at killing Vek comes out.',
    'Pinnacle are all A.I.s/Sentients, just to reinforce the robotic theme (even though there are humans on the island).',
    'Detritus pilots are cautious, careful (both due to their profession), and polite - they, like their CEO, believe in safety first and ""disposing"" of hazardous material (including Vek) safely vs. swiftly. They are more matter-of-fact and focus on metrics and results. ""Haste makes waste"" is a good Old Earth expression for explaining their slow, methodical approach.',
    'Classic cold knowledgeable veteran type. No time for those who can\'t keep up. Cynical/realistic about your chances. Not a very exaggerated character.',
    'Caring, intelligent, pragmatic. A bit naive to war. Constantly hopeful & encouraging. Looks for the best in humanity.',
    'Stoic, calculating, cold. Soft spoken.',
    'Inquisitive; Focused on learning more than just fighting. Easily distracted. Somewhat disinterested and uncaring. Not very empathic.',
    'Prospero has been repurposed to operate its Mech in harsh conditions. Its English is fine but isn\'t in love with the new ""work"" conditions.',
    'Really excited. Hopeful and a little silly. Feels invulnerable. Sees it as a game.',
    'Chen is conscientious, reliable, and tries to be a model soldier. He\'s one of the best examples of managerial skill and leadership at Detritus, and it comes through in fighting the Vek.',
    'Cocky. Feels he is the hero. Feels invulnerable. Feels he couldn\'t possibly be wrong.',
    'Prototypical good soldier. Treats the battle like a military war. Doesn\'t have time for nonsense. Wishes others were as professional. While she shares traits with Chen Rong, they occasionally (quietly) clash on military issues (she\'s more hands-on in the fighting, while Rong\'s more of a supervising officer).',
    'Construction robot adapted for military use. Meant to interface with people so speaks in sentences but is very curt and unemotional.',
    'Paranoid & pessimistic. Generally a good person but not handling all the stress well, and his attitude can sometimes be demoralizing - he\'s suspicious of his own successes and victories. Definitely a ""this timeline\'s already half-lost"" kind of guy. Stutters because of temporal research studies... it\'s caused a nervous system problem in his speech patterns.',
    'A relatively calm, pragmatic machine who has adjusted to the change in its original purpose of mineral survey to destruction. It tends to quantify its responses in terms of how actions will affect the environment first, then the individuals second.',
    'Well-mannered, aristocratic, superior (he comes from a more advanced timeline, he believes), and can be condescending toward humans.',
    'Mantis speak in a kind of chittering - (i.e. names having a lot of k\'s or tch\'s kinda sounds).',
    'Zoltan are energy beings… so perhaps a wispy ethereal speak.',
    'Rock people ""speech"" is like a low grumble - slower, almost a \'rocks grinding\' sound.'
  ],
  'additionalTranslationFiles': {
    /*'scripts/missions/acid/mission_acidtank.lua': {
      0: {'text': 'Kill 4 enemies inflicted with A.C.I.D.', 'lines': [4, 18]},
    },*/
  }
}

shared.getLuaFiles = function (dir, filter, out) {
  if (typeof out === 'undefined') out = []
  const files = fs.readdirSync(dir)
  files.forEach(function (file) {
    let path = dir + '/' + file
    if (fs.lstatSync(path).isDirectory()) {
      shared.getLuaFiles(path, filter, out)
    } else if (file.substr(-4) === '.lua') {
      if (filter && !path.match(new RegExp(filter))) {
        return
      }
      out.push(path)
    }
  })
  return out
}

shared.getAllOtherLuaFiles = function (dir, out) {
  const files = fs.readdirSync(dir)
  files.forEach(function (file) {
    let path = dir + '/' + file
    if (path.match(/\/text\.lua|\/text_.*?\.lua/)) {
      return
    }
    if (fs.lstatSync(path).isDirectory()) {
      shared.getAllOtherLuaFiles(path, out)
    } else if (file.substr(-4) === '.lua') {
      out.push(path)
    }
  })
  return out
}

shared.escapeRegex = function (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

shared.getLineContext = function (lineTrimmed, currentContext) {
  let context = currentContext
  if (typeof shared.contexts[lineTrimmed] !== 'undefined') {
    context = shared.contexts[lineTrimmed]
  }
  if (lineTrimmed === '}' && context !== null) {
    context = null
  }
  return context
}
/**
 * Parse po file
 * @param {[]} lines
 * @param {=bool} flat
 * @return {object}
 */
shared.parsePoFile = function (lines, flat) {
  let currentId = null
  let msgData = {}
  let translations = {}
  lines.forEach(function (line, lineNr) {
    line = line.trim()
    let contextMatch = line.match(/^(msg[a-z]+)/, line)
    if (contextMatch) {
      line = line.substr(contextMatch[1].length + 1)
      if (contextMatch[1] === 'msgctxt') {
        msgData = {'key': lineNr}
      }
      currentId = contextMatch[1]
    }
    if (line.substr(0, 1) === '"' && currentId !== null) {
      if (typeof msgData[currentId] === 'undefined') {
        msgData[currentId] = {'lines': [], 'text': []}
      }
      let v = line.substring(1, line.length - 1)
      msgData[currentId].lines.push(lineNr)
      if (v.length) {
        msgData[currentId].text.push(v)
      }
    }
    if (typeof msgData.key !== 'undefined') {
      let o = msgData
      if (flat) {
        o = {}
        for (let i in msgData) {
          if (i === 'key') continue
          o[i] = typeof msgData[i].text !== 'undefined' ? msgData[i].text.join('') : null
        }
      }
      if (o.msgctxt) {
        translations[msgData.key] = o
      }
    }
  })
  return translations
}
module.exports = shared