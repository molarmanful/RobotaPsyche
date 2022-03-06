# Ecosystem Assignment 2

[p5 DEMO](https://bennyboy.tech/RobotaPsyche/midterm/)

For this midterm project, I decided to expand on my previous ecosystem assignment by implementing many of the items on the previous TODO list.

## New Features

### Genetics

I altered how organism stats are handled such that each stat can be passed onto offspring much like a genetic trait would. Many of an organism's characteristics are affected by genetics: color, maximum energy, maximum lifespan, energy efficiency, etc. In addition, each trait has a 10% chance to mutate, creating up to a 10% variation in trait value. With plants, since they reproduce asexually (i.e. "mitosis"), plant offsprings' traits are solely determined by a single parent's traits and mutations. But with herbies and preds, both of which reproduce sexually, offspring traits are determined by both parents' traits and mutations.

The goal with implementing genetics was to allow the ecosystem and its constituent organisms to "self-balance" via natural selection. Ideally within a species, organisms with unfavorable traits would likely die out while organisms with favorable traits would pass on their traits via reproduction. In practice, likely due to the capped number of each organism allowed in the ecosystem, each species takes quite a few generations to find population stability.

### Altered Movement Behaviors

