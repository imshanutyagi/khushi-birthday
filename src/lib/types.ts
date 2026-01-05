export interface PageContent {
  id: string;

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
}

export interface Gift {
  id: string;
  title: string;
  description: string;
  images: string[];
  enabled: boolean;
  order: number;
  isCustomText?: boolean;
  customText?: string;
  showInSelection?: boolean;  // Show on Page 5 (Gift Selection)
  showInLuckGame?: boolean;   // Show on Page 6 (Luck Game)
}

export interface UserSelection {
  id?: string;
  selectedGiftId: string | null;
  customText?: string;
  openedGiftIds: string[];
  timestamp: number;
  userAgent?: string;
}

export interface MediaAsset {
  id: string;
  type: 'image' | 'audio';
  name: string;
  url: string;
  uploadedAt: number;
}
