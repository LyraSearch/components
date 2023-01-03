export function CUSTOM_STOP_WORDS_ARRAY_MUST_BE_STRING_ARRAY(): string {
  return `Custom stop words array must only contain strings.`;
}

export function CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY(): string {
  return `Custom stop words must be a function or an array of strings.`;
}

export function INVALID_STEMMER_FUNCTION_TYPE(): string {
  return `tokenizer.stemmingFn property must be a function.`;
}

export function INVALID_TOKENIZER_FUNCTION(): string {
  return `tokenizer.tokenizerFn must be a function.`;
}
