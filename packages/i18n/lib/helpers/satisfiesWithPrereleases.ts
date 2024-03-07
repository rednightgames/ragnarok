import semver from "semver";

const satisfiesWithPrereleasesCache = new Map<string, semver.Range | null>();

const satisfiesWithPrereleases = (
  version: string | null,
  range: string,
  loose: boolean = false,
) => {
  if (!version) {
    return false;
  }

  const key = `${range}${loose}`;
  let semverRange = satisfiesWithPrereleasesCache.get(key);
  if (typeof semverRange === `undefined`) {
    try {
      semverRange = new semver.Range(range, {includePrerelease: true, loose});
    } catch {
      return false;
    } finally {
      satisfiesWithPrereleasesCache.set(key, semverRange || null);
    }
  } else if (semverRange === null) {
    return false;
  }

  let semverVersion: semver.SemVer;
  try {
    semverVersion = new semver.SemVer(version, semverRange);
  } catch (err) {
    return false;
  }

  if (semverRange.test(semverVersion)) {
    return true;
  }

  if (semverVersion.prerelease) {
    semverVersion.prerelease = [];
  }

  return semverRange.set.some((comparatorSet) => {
    for (const comparator of comparatorSet) {
      if (comparator.semver.prerelease) {
        comparator.semver.prerelease = [];
      }
    }

    return comparatorSet.every((comparator) => {
      return comparator.test(semverVersion);
    });
  });
};

export default satisfiesWithPrereleases;
