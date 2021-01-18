// manual override
let themeLocked = false;

function getTheme(state) {
  if (state && state.theme && state.themeOverrides) {
    // get page name
    const page = window.location.pathname.split('/')[1];

    if (page in state.themeOverrides) {
      return state.themeOverrides[page];
    }

    return state.theme;
  }

  return 'default';
}

// https://stackoverflow.com/questions/6229197/how-to-know-if-two-arrays-have-the-same-values
const containsAll = (arr1, arr2) =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));
const sameMembers = (arr1, arr2) =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);

const mapClassList =
  'doom boe dragon blackheart mines shrines garden tomb warhead cursed volskaya sky braxis hanamura alterac';
