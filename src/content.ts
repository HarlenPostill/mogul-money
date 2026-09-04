import japanImage from './assets/geo/Japan.png'
import australiaOneImage from './assets/geo/Australia-1.png'
import scotlandImage from './assets/geo/Scottland.png'
import americaImage from './assets/geo/America.png'
import australiaTwoImage from './assets/geo/Australia-2.png'
import type { BoardContent, FinalContent } from './types'

/** All game content lives here. Clues are ordered easiest to hardest. */

export const BOARD_1: BoardContent = {
  baseValue: 100,
  categories: [
    {
      title: 'Do you have games on your phone?',
      description: 'Do you? can I have a turn?',
      clues: [
        { question: 'This endless runner is commonly associated with brainrot videos.', answer: 'Subway Surfers' },
        { question: 'This literal copycat repeats anything you say in a high-pitched voice.', answer: 'Talking Tom' },
        { question: 'This notoriously difficult bird-rage game was removed from the App Store.', answer: 'Flappy Bird' },
        { question: 'Featuring Om Nom, a green alien, this game was released in 2010.', answer: 'Cut the Rope' },
        { question: 'This game was a viral public-safety campaign by Metro Trains Melbourne.', answer: 'Dumb Ways to Die' },
      ],
    },
    {
      title: 'Geo-guesser',
      description: 'Name the country shown in each image.',
      clues: [
        { question: 'Which country is shown here?', answer: 'Japan', image: japanImage, imageAlt: 'Geo-guesser image of Japan' },
        { question: 'Which country is shown here?', answer: 'Australia', image: australiaOneImage, imageAlt: 'Geo-guesser image of Australia' },
        { question: 'Which country is shown here?', answer: 'Scotland', image: scotlandImage, imageAlt: 'Geo-guesser image of Scotland' },
        { question: 'Which country is shown here?', answer: 'America', image: americaImage, imageAlt: 'Geo-guesser image of America' },
        { question: 'Which country is shown here?', answer: 'Australia', image: australiaTwoImage, imageAlt: 'Geo-guesser image of Australia' },
      ],
    },
    {
      title: 'Before and after',
      description: 'Two things joined by a shared word.',
      clues: [
        { question: 'Combine “Despicable Me” and “me time.”', answer: 'Despicable Me Time' },
        { question: 'Combine “BeReal” and “real estate.”', answer: 'BeReal Estate' },
        { question: 'Combine “Google Drive” and “drive-by.”', answer: 'Google Drive-By' },
        { question: 'Combine “Triple J” and “J-pop.”', answer: 'Triple J-Pop' },
        { question: 'Combine “one piece” and “pièce de résistance.”', answer: 'One Pièce de Résistance' },
      ],
    },
    {
      title: 'TikTok',
      description: 'Its all about time.',
      clues: [
        { question: 'A leap year, in which calendars have 366 days instead of the usual 365, occurs this often.', answer: 'Every 4 years' },
        { question: 'This term for a 1,000-year span comes from the Latin words for “thousand” and “year.”', answer: 'Millennium' },
        { question: 'This calendar month is named after Janus, the Roman god of beginnings and transitions.', answer: 'January' },
        { question: 'In Greek mythology, this god personified time and was often depicted as an old man carrying a scythe.', answer: 'Cronus' },
        { question: 'This is the amount of time it takes for half of a radioactive substance to decay.', answer: 'Half-life' },
      ],
    },
    {
      title: 'Words in Ari Merten',
      description: 'Every answers must be unscrambled from the word “Merten.”',
      clues: [
        { question: 'In order to live on a landlord’s property legally, you must pay this.', answer: 'Rent' },
        { question: 'The giant sequoia and the weeping willow are specific types of this large plant.', answer: 'Tree' },
        { question: 'Unlike in uni, the high-school year is broken up into four of these periods of time.', answer: 'Term' },
        { question: 'This key moves the insertion point, or caret, to a new line.', answer: 'Enter' },
        { question: 'This measuring unit was originally defined during the French Revolution as one ten-millionth of the shortest distance from the North Pole to the equator.', answer: 'Metre' },
      ],
    },
  ],
}

export const BOARD_2: BoardContent = {
  baseValue: 200,
  categories: [
    {
      title: 'Do you know your ABCs?',
      description: 'ABC (Australian Broadcasting Company) trivia.',
      clues: [
        { question: 'This ABC-run radio station counts down the most popular voted songs in late January.', answer: 'Triple J' },
        { question: 'This TV channel, targeted at primary-school kids, launched in 2009 before later rebranding to ABC ME.', answer: 'ABC3' },
        { question: 'This bear toy is Play School’s longest-serving toy, having featured in the first episode in 1966.', answer: 'Big Ted' },
        { question: 'Before becoming the Australian Broadcasting Corporation, the ABC was called this.', answer: 'Australian Broadcasting Commission' },
        { question: 'The ABC’s first public transmission was made through this medium.', answer: 'Radio' },
      ],
    },
    {
      title: 'I’m bored',
      description: 'Board games and the characters within them.',
      clues: [
        { question: 'In CATAN, players collect these materials to build a city.', answer: 'Wheat and stone' },
        { question: 'This colour represents the cheapest property spaces in Monopoly.', answer: 'Brown' },
        { question: 'These two Scrabble tiles are worth the highest individual letter points.', answer: 'Q and Z' },
        { question: 'This chess move lets a pawn capture an adjacent enemy pawn in its path.', answer: 'En passant' },
        { question: 'Represented by the colour purple, this Cluedo character is a potential killer.', answer: 'Professor Plum' },
      ],
    },
    {
      title: 'QWERTY',
      description: 'Keyboard know-how.',
      clues: [
        { question: 'If you wanted to', answer: 'To be confirmed' },
        { question: 'What is the shortcut for undo?', answer: 'Ctrl + Z (or Command + Z)' },
        { question: 'What is the shortcut to reopen a closed tab?', answer: 'Ctrl + Shift + T (or Command + Shift + T)' },
        { question: 'What is the output of Shift + 7?', answer: '&' },
        { question: 'What is the last English letter in the middle row of a QWERTY keyboard?', answer: 'L' },
      ],
    },
    {
      title: 'Before and after 2',
      description: 'Even more things joined by a shared word.',
      clues: [
        { question: 'Combine “The Lion King” and “King Charles.”', answer: 'The Lion King Charles' },
        { question: 'Combine “Lionel Messi” and “Messina.”', answer: 'Lionel Messina' },
        { question: 'Combine “JB Hi-Fi” and “high five.”', answer: 'JB Hi-Five' },
        { question: 'Combine “Spider-Man” and “Manchester United.”', answer: 'Spider-Manchester United' },
        { question: 'Combine “Snapchat” and “ChatGPT.”', answer: 'SnapchatGPT' },
      ],
    },
    {
      title: 'Words in university',
      description: 'Every answers must unscrambled from the word “university.”',
      clues: [
        { question: 'This questionnaire gathers information about people’s opinions, habits, or experiences.', answer: 'Survey' },
        { question: 'Describing something unwanted that interferes with someone’s privacy or personal space.', answer: 'Intrusive' },
        { question: 'A soldier or guard stationed at a specific place to watch for danger.', answer: 'Sentry' },
        { question: 'Liquid waste produced by the kidney.', answer: 'Urine' },
        { question: 'In Shakespeare’s Romeo and Juliet, this character serves as Juliet’s loyal confidante and messenger.', answer: 'Nurse' },
      ],
    },
  ],
}

export const FINAL: FinalContent = {
  category: 'Final Mogul',
  question: 'Which Australian city is further west from Sydney: Melbourne or Hobart?',
  answer: 'Melbourne',
}
