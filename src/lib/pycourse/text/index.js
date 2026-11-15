// Teaching text for every lesson: a story, simple points, three programs
// (Easy → Medium → Challenge), cards and a quiz built only on what the lesson shows.
import { BEGINNER } from './beginner';
import { INTERMEDIATE } from './intermediate';
import { ADVANCED } from './advanced';
export { OUTPUTS } from './outputs';
export const TEXT = { ...BEGINNER, ...INTERMEDIATE, ...ADVANCED };
