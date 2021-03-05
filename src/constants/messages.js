export const generalMessages = {};

export const successMessages = {};

export const errorMessages = {
  // Defaults
  default: 'Hmm, an unknown error occured',
  timeout: 'Server Timed Out. Check your internet connection',
  invalidJson: 'Response returned is not valid JSON',

  // Firebase Related
  invalidFirebase: 'Firebase is not connected correctly',

  // Member
  memberExists: 'memberExists',
  missingFirstName: 'missingFirstName',
  missingLastName: 'missingLastName',
  missingEmail: 'missingEmail',
  missingPassword: 'missingPassword',
  passwordsDontMatch: 'passwordsDontMatch',
  unverifiedEmail: 'unverifiedEmail',
};
