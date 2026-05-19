/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SponsorshipPackage {
  level: string;
  price: string;
  features: string[];
  mostPrestigious?: boolean;
}

export const SPONSORSHIP_PACKAGES: SponsorshipPackage[] = [
  {
    level: "Platinum",
    price: "₱30,000",
    features: [
      "Recognition on event materials",
      "Acknowledgment during program",
      "Premium seating",
      "Plaque of appreciation"
    ],
    mostPrestigious: true
  },
  {
    level: "Diamond",
    price: "₱25,000",
    features: [
      "Logo in posters & online",
      "Acknowledgment during program",
      "Reserved seating",
      "Personalized token"
    ]
  },
  {
    level: "Gold",
    price: "₱20,000",
    features: [
      "Social media recognition",
      "Program acknowledgment",
      "Reserved seating",
      "Certificate of appreciation"
    ]
  },
  {
    level: "Silver",
    price: "₱15,000",
    features: [
      "Thank you board inclusion",
      "Program acknowledgment",
      "Certificate of appreciation"
    ]
  }
];

export const PAYMENT_METHODS = {
  bank: {
    name: "UnionBank of the Philippines",
    accountName: "Tara Marie Lim Mosqueda",
    accountNumber: "1093 5672 9531",
    swiftCode: "UBPHPHMMXXX",
    bankCode: "010419995"
  },
  gcash: {
    accountName: "Tara Marie Mosqueda",
    mobileNumber: "0917 154 4961"
  }
};

export const CONTACT_FACEBOOK = "https://www.facebook.com/SJAGAH2026/";
export const REGISTRATION_URL = "https://form.jotform.com/260610707169052";
