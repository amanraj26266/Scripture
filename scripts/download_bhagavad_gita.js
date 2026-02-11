#!/usr/bin/env node
/**
 * Fetch Bhagavad Gita text and save to data/bhagavad_gita.txt
 * Uses a public domain source if available, or creates sample content
 */

import fs from 'fs'
import path from 'path'
import fetch from 'node-fetch'

async function downloadBhagavadGita() {
  const dataDir = path.resolve(process.cwd(), 'data')
  const filePath = path.join(dataDir, 'bhagavad_gita.txt')

  // Create data directory if it doesn't exist
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }

  // Check if file already exists
  if (fs.existsSync(filePath)) {
    console.log('✓ bhagavad_gita.txt already exists')
    return
  }

  console.log('Downloading Bhagavad Gita text...')

  try {
    // Try to fetch from a public GitHub repository (plain text version)
    const gitHubUrl = 'https://raw.githubusercontent.com/hindubooks/bhagavad-gita/master/bg.txt'
    const response = await fetch(gitHubUrl, { timeout: 10000 })

    if (response.ok) {
      const text = await response.text()
      fs.writeFileSync(filePath, text, 'utf8')
      console.log(`✓ Downloaded Bhagavad Gita (${text.length} chars) to ${filePath}`)
      return
    }
  } catch (err) {
    console.warn('Could not fetch from GitHub, trying alternate source...')
  }

  // Fallback: Create a sample with Chapter 1 and 2 (representative content)
  const sampleText = `
BHAGAVAD GITA - THE SONG OF THE LORD

Chapter 1: Observing the Armies on the Battlefield of Kurukshetra

1.1 Dhritarashtra said: O Sanjaya, after assembling in the place of pilgrimage at Kurukshetra, what did my people and the Pandavas do, being desirous to fight?

1.2 Sanjaya said: O King, after looking over the army arranged in military formation by the sons of Pandu, King Duryodhana went to his teacher and spoke the following words:

1.3 O my teacher, behold the great army of the sons of Pandu, so expertly arranged by your intelligent disciple the son of Drupada.

1.4 Here in this army there are many heroic bowmen equal in fighting to Bhima and Arjuna: great fighters like Yuyudhana, Virata, and Drupada.

1.5 There are also great, heroic, powerful fighters here like Dhrishtaketu, Cekitana, Kasiraja, Purujit, Kuntibhoja, and Shaibya.

1.6 There are the mighty Yudhamanyu, the very powerful Uttamaujas, the son of Subhadra, and the sons of Draupadi. All these warriors are great chariot fighters.

1.7 But for your information, O best of the brahmins, let me tell you about the captains who are worthy of special mention. I am opining them for you:

1.8 There are myself, Bhima, Arjuna, Satyaki, Ashvatthama, Vikarna, and Jayadratha, who are all very great chariot warriors.

1.9 There are many other heroes who are prepared to lay down their lives for my sake. All are well equipped with different kinds of weapons, and all are experienced in military science.

1.10 Our strength is immeasurable, and we are perfectly protected by Grandfather Bhishma, whereas the strength of the Pandavas, carefully protected by Bhima, is limited.

1.11 Now all of you should firmly guard Bhishma, as you stand at your respective strategic points on this battlefield.

Chapter 2: Contents of the Gita Summarized

2.1 Sanjaya said: Seeing Arjuna full of compassion, his mind depressed, his eyes full of tears, Madhusudana, Lord Krishna, spoke these words:

2.2 The Blessed Lord said: Arjuna, how have these impurities come upon you? They are not at all befitting a man who knows the principles of life. They do not lead to higher planets, but to infamy.

2.3 O son of Pritha, do not yield to this degrading impotence. It does not become you. Shake off this petty weakness of your heart and arise, O chastiser of the enemy!

2.4 Arjuna said: O killer of Madhu, O killer of the demon Kaitabha, how can I counterattack with arrows in battle men like Bhishma and Drona, who are worthy of my worship?

2.5 It would be better to live in this world by begging than to live at the cost of the lives of great souls who are my teachers. Even though they are avaricious, they are nonetheless my masters.

2.6 Nor do I know how to settle this enmity, nor will it lead to a happy solution. Whether we conquer them or they conquer us, only death will welcome us after we kill Bhishma and Drona, the friends of our father.

2.7 Now I am confused about my duty and have lost all composure because of miserly weakness. In this condition I am asking You: which is the better path? Please tell me decisively. I am Your disciple, and a soul surrendered unto You. Please instruct me.

2.8 I can find no means to drive away this sorrow which is drying up my senses. I will not be able to destroy it even if I win an unrivaled kingdom on the earth with sovereignty over the demigods, or even if I gain supreme dominion.

2.9 Sanjaya said: Having spoken thus, Arjuna, chastiser of the enemy, told Krishna, "Govinda, I shall not fight," and fell silent.

2.10 O descendant of Bharata, at that time Madhusudana, smiling, spoke to the grief-stricken Arjuna within the midst of the two armies.

[The text continues with Lord Krishna's teachings on duty, karma, devotion, and the ultimate nature of reality. This represents the sacred dialogue between Krishna and his disciple Arjuna on the battlefield of Kurukshetra.]

For full text, refer to authorized translations of the Bhagavad Gita
  `

  fs.writeFileSync(filePath, sampleText.trim(), 'utf8')
  console.log(`✓ Created sample Bhagavad Gita text (${sampleText.length} chars) at ${filePath}`)
}

downloadBhagavadGita().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
