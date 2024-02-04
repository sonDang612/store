export function findMatches(
  regex: RegExp,
  str: string,
  matches: string[] = [],
) {
  const res = regex.exec(str);
  res && matches.push(res[1]) && findMatches(regex, str, matches);
  return matches;
}
