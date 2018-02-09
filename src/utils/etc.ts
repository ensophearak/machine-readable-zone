import { UserInfo, MRZCommandLineArgs, MRZGeneratorArgs } from 'machine-readable-zone';
import {
  getStringOrDefault,
  getBooleanOrDefault,
  validateNonEmpty,
  validateNumeric,
  validateCountryCode,
  validateDate,
  validateGender,
  validatePersonalNumber,
  validateFields,
  FieldError,
  ValidationSchema,
  DEFAULT_PERSONAL_NUMBER,
} from './validate-args';
import { IntermediateCommandLineArgs } from './parse-args';
import { EOL } from 'os';

interface ArgsValidationResult {
  isValid: boolean;
  errors: FieldError[];
}

export interface ParsedCommandLineArgs extends UserInfo {}

const PASSPORT_NUMBER_LENGTH = 9;
const PASSPORT_NUMBER_CONSTRAINTS = {
  exactLength: PASSPORT_NUMBER_LENGTH,
};

export const NEW_LINE = EOL;

export const extractSupportedCommandLineArgs = (
  args: IntermediateCommandLineArgs,
): MRZCommandLineArgs => {
  return {
    version: getBooleanOrDefault(args.version),
    help: getBooleanOrDefault(args.help),
    countries: getBooleanOrDefault(args.countries),
    user: {
      firstName: getStringOrDefault(args.firstName),
      lastName: getStringOrDefault(args.lastName),
      passportNumber: getStringOrDefault(args.passportNumber),
      countryCode: getStringOrDefault(args.countryCode),
      nationality: getStringOrDefault(args.nationality),
      birthday: getStringOrDefault(args.birthday),
      gender: getStringOrDefault(args.gender),
      validUntilDay: getStringOrDefault(args.validUntilDay),
      personalNumber: getStringOrDefault(args.personalNumber, DEFAULT_PERSONAL_NUMBER),
    },
  };
};

export const SCHEMA = {
  firstName: validateNonEmpty,
  lastName: validateNonEmpty,
  passportNumber: validateNumeric(PASSPORT_NUMBER_CONSTRAINTS),
  countryCode: validateCountryCode,
  nationality: validateCountryCode,
  birthday: validateDate,
  gender: validateGender,
  validUntilDay: validateDate,
  personalNumber: validatePersonalNumber,
};

export const validateGenerationData = (
  args: MRZGeneratorArgs,
  schema: ValidationSchema = SCHEMA,
): ArgsValidationResult => {
  const errors = validateFields(args.user, schema);

  return {
    errors,
    isValid: errors.length === 0,
  };
};
