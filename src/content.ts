import type { BoardContent, FinalContent } from './types'

/**
 * All game content lives here. Edit freely — the app derives point values from
 * position, so you only need to keep each category at exactly 5 clues ordered
 * easiest (row 0) to hardest (row 4).
 */

export const BOARD_1: BoardContent = {
  baseValue: 100,
  categories: [
    {
      title: 'Startup Slang',
      description: 'The buzzwords founders deploy when they want more money.',
      clues: [
        { question: 'This two-word term describes the money a startup burns through each month.', answer: 'Burn rate' },
        { question: 'A startup valued at over one billion dollars earns this mythical nickname.', answer: 'A unicorn' },
        { question: 'This abbreviation describes the earliest shippable version of a product.', answer: 'MVP (minimum viable product)' },
        { question: 'When a company abruptly changes its core business model, it does this.', answer: 'Pivot' },
        { question: 'This term describes the moment a startup finally earns more than it spends.', answer: 'Ramen profitable (accept: break even)' },
      ],
    },
    {
      title: 'Big Brands',
      description: 'Logos you have seen ten thousand times. Prove it.',
      clues: [
        { question: 'This company’s logo is a bitten piece of fruit.', answer: 'Apple' },
        { question: 'The swoosh belongs to this sportswear giant.', answer: 'Nike' },
        { question: 'This coffee chain’s logo features a twin-tailed siren.', answer: 'Starbucks' },
        { question: 'The arrow in this delivery company’s logo points from A to Z.', answer: 'Amazon' },
        { question: 'This carmaker’s four interlocking rings represent a 1932 merger of four firms.', answer: 'Audi' },
      ],
    },
    {
      title: 'Show Me The Money',
      description: 'Currencies, notes, and the people printed on them.',
      clues: [
        { question: 'This is the official currency of Japan.', answer: 'The yen' },
        { question: 'The euro is the official currency of this many EU member states as of 2025 — within two.', answer: '20' },
        { question: 'This US president appears on the one hundred dollar bill.', answer: 'Nobody — Benjamin Franklin was never president' },
        { question: 'Bitcoin’s pseudonymous creator published its whitepaper under this name.', answer: 'Satoshi Nakamoto' },
        { question: 'This country’s currency, the rand, is named after a ridge of gold-bearing rock.', answer: 'South Africa' },
      ],
    },
    {
      title: 'Boardroom Drama',
      description: 'Famous hirings, firings, and spectacular flameouts.',
      clues: [
        { question: 'This Apple co-founder was famously ousted from his own company in 1985.', answer: 'Steve Jobs' },
        { question: 'This blood-testing startup collapsed after its technology was revealed to be a fraud.', answer: 'Theranos' },
        { question: 'This ride-hailing company’s founder resigned as CEO in 2017 under investor pressure.', answer: 'Uber (Travis Kalanick)' },
        { question: 'This energy giant’s 2001 accounting scandal took down auditor Arthur Andersen with it.', answer: 'Enron' },
        { question: 'This co-working company’s IPO imploded in 2019, taking its founder with it.', answer: 'WeWork' },
      ],
    },
    {
      title: 'Pop Culture Payday',
      description: 'When entertainment and enormous piles of cash collide.',
      clues: [
        { question: 'This 1997 film held the record as the highest-grossing movie ever for twelve years.', answer: 'Titanic' },
        { question: 'This streaming service began life mailing DVDs in red envelopes.', answer: 'Netflix' },
        { question: 'Robert Downey Jr. played this character across more than a decade of Marvel films.', answer: 'Iron Man / Tony Stark' },
        { question: 'This musician’s Eras Tour became the first concert tour to gross over one billion dollars.', answer: 'Taylor Swift' },
        { question: 'This video game franchise’s 2013 instalment made a billion dollars in three days.', answer: 'Grand Theft Auto (GTA V)' },
      ],
    },
  ],
}

export const BOARD_2: BoardContent = {
  baseValue: 200,
  categories: [
    {
      title: 'Tech Titans',
      description: 'The people behind the companies behind everything.',
      clues: [
        { question: 'This man founded SpaceX and later acquired Twitter.', answer: 'Elon Musk' },
        { question: 'Larry Page and this person co-founded Google in 1998.', answer: 'Sergey Brin' },
        { question: 'This company was founded in a Harvard dorm room in 2004.', answer: 'Facebook / Meta' },
        { question: 'This Microsoft CEO took over from Steve Ballmer in 2014.', answer: 'Satya Nadella' },
        { question: 'This Taiwanese-American engineer co-founded and still leads the chipmaker NVIDIA.', answer: 'Jensen Huang' },
      ],
    },
    {
      title: 'Market Meltdowns',
      description: 'Bubbles, crashes, and other reasons to check your portfolio.',
      clues: [
        { question: 'The stock market crash that began the Great Depression happened in this year.', answer: '1929' },
        { question: 'This 17th-century Dutch mania involved wildly overpriced flower bulbs.', answer: 'Tulip mania' },
        { question: 'The 2008 financial crisis was triggered by the collapse of this type of loan market.', answer: 'Subprime mortgages' },
        { question: 'This investment bank filed for bankruptcy in September 2008.', answer: 'Lehman Brothers' },
        { question: 'This 1987 single-day crash is known by this colourful name.', answer: 'Black Monday' },
      ],
    },
    {
      title: 'Geography Of Gold',
      description: 'Places that made, moved, or hoarded the money.',
      clues: [
        { question: 'The New York Stock Exchange sits on this famous street.', answer: 'Wall Street' },
        { question: 'This tiny European country is famous for banking secrecy and neutrality.', answer: 'Switzerland' },
        { question: 'The world’s tallest building, the Burj Khalifa, stands in this city.', answer: 'Dubai' },
        { question: 'This desert country holds the world’s largest proven oil reserves after Venezuela.', answer: 'Saudi Arabia' },
        { question: 'The 1849 gold rush drew hundreds of thousands to this US state.', answer: 'California' },
      ],
    },
    {
      title: 'Fine Print',
      description: 'Business terms that hide in contracts and ruin weekends.',
      clues: [
        { question: 'This document is what a company files to go public.', answer: 'A prospectus (accept: S-1)' },
        { question: 'This three-letter acronym describes a company’s first public share sale.', answer: 'IPO' },
        { question: 'This agreement stops an employee from spilling company secrets.', answer: 'An NDA' },
        { question: 'This clause lets an investor sell their shares alongside a majority shareholder.', answer: 'Tag-along rights' },
        { question: 'This financial statement shows cash in versus cash out over a period.', answer: 'The cash flow statement' },
      ],
    },
    {
      title: 'Wildly Expensive',
      description: 'Absurd price tags from around the world.',
      clues: [
        { question: 'This Leonardo da Vinci painting sold for 450 million dollars in 2017.', answer: 'Salvator Mundi' },
        { question: 'This spice is, by weight, the most expensive in the world.', answer: 'Saffron' },
        { question: 'The most expensive metal by weight is often cited as this precious element, not gold.', answer: 'Rhodium' },
        { question: 'This annual sporting event sells the most expensive TV advertising slots in the US.', answer: 'The Super Bowl' },
        { question: 'This Japanese fish routinely sells for millions at Tokyo’s new-year auction.', answer: 'Bluefin tuna' },
      ],
    },
  ],
}

export const FINAL: FinalContent = {
  category: 'Final Mogul',
  question:
    'This company, founded in 1602, is widely considered the first to issue tradeable shares to the public.',
  answer: 'The Dutch East India Company (VOC)',
}
