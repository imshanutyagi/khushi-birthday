import mongoose, { Schema, Model } from 'mongoose';

export interface IPageContent {
  // Page 1 - Intro
  introText1: string;
  introText2: string;
  introText3: string;
  readyText: string;
  readyButtonText: string;

  // Page 2 - Cake
  cakeInstruction: string;
  cakeImageUrl: string;
  birthdaySongUrl: string;
  clapSoundUrl: string;

  // Page 3 - Wishes
  wishesTitle: string;
  wishesMessage: string;
  wishesButtonText: string;

  // Page 4 - Promises
  promisesTitle: string;
  promise1: string;
  promise2: string;
  promise3: string;
  promiseButton1Text: string;
  promiseButton2Text: string;
  promiseButton3Text: string;

  // Page 5 - Gifts
  giftsTitle: string;
  giftsInstruction: string;

  // Page 6 - Luck
  luckTitle: string;
  luckInstruction: string;
  finalMessage: string;

  // Special Song
  songTitle?: string;
  songLyrics?: string;
  songUrl?: string;
  syncedLyrics?: Array<{ time: number; text: string }>;

  updatedAt: Date;
}

const PageContentSchema = new Schema<IPageContent>(
  {
    // Page 1
    introText1: { type: String, default: 'Today is 4 January.' },
    introText2: { type: String, default: 'This is the day when you were born,' },
    introText3: { type: String, default: 'and it is not only special for you, but also for me.' },
    readyText: { type: String, default: 'Are you ready?' },
    readyButtonText: { type: String, default: 'I am ready ❤️' },

    // Page 2
    cakeInstruction: { type: String, default: 'Swipe once on the cake to cut it 🎂' },
    cakeImageUrl: { type: String, default: '' },
    birthdaySongUrl: { type: String, default: '' },
    clapSoundUrl: { type: String, default: '' },

    // Page 3
    wishesTitle: { type: String, default: 'Best Wishes for You' },
    wishesMessage: {
      type: String,
      default: 'You are the most special person in my life. Every moment with you is precious. Happy Birthday, my love!',
    },
    wishesButtonText: { type: String, default: 'See my promises 💌' },

    // Page 4
    promisesTitle: { type: String, default: 'My Promises to You' },
    promise1: { type: String, default: 'I promise to always be by your side, through every joy and challenge.' },
    promise2: { type: String, default: 'I promise to make you smile every single day.' },
    promise3: { type: String, default: 'I promise to love you more with each passing moment.' },
    promiseButton1Text: { type: String, default: 'Reveal 1st Promise' },
    promiseButton2Text: { type: String, default: 'Reveal 2nd Promise' },
    promiseButton3Text: { type: String, default: 'Reveal 3rd Promise' },

    // Page 5 & 6
    giftsTitle: { type: String, default: 'Choose Your Gift' },
    giftsInstruction: { type: String, default: 'You can pick any ONE 💝' },
    luckTitle: { type: String, default: "It's time for your luck! 🍀" },
    luckInstruction: { type: String, default: 'Watch carefully as the boxes shuffle...' },
    finalMessage: {
      type: String,
      default: 'All the gifts will be handed over 🎉\nThank you for being a part of my life ❤️',
    },

    // Special Song
    songTitle: { type: String, default: '' },
    songLyrics: { type: String, default: '' },
    songUrl: { type: String, default: '' },
    syncedLyrics: { type: [{ time: Number, text: String }], default: [] },
  },
  {
    timestamps: true,
  }
);

const PageContent: Model<IPageContent> =
  mongoose.models.PageContent || mongoose.model<IPageContent>('PageContent', PageContentSchema);

export default PageContent;
