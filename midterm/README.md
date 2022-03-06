# Ecosystem Assignment 2

[p5 DEMO](https://bennyboy.tech/RobotaPsyche/midterm/)

For this midterm project, I decided to expand on my previous ecosystem assignment by implementing many of the items on the previous TODO list.

## New Features

### Genetics

I altered how organism stats are handled such that each stat can be passed onto offspring much like a genetic trait would. Many of an organism's characteristics are affected by genetics: color, maximum energy, maximum lifespan, energy efficiency, etc. In addition, each trait has a 10% chance to mutate, creating up to a 10% variation in trait value. With plants, since they reproduce asexually (i.e. "mitosis"), plant offsprings' traits are solely determined by a single parent's traits and mutations. But with herbies and preds, both of which reproduce sexually, offspring traits are determined by both parents' traits and mutations.

The goal with implementing genetics was to allow the ecosystem and its constituent organisms to "self-balance" via natural selection. Ideally within a species, organisms with unfavorable traits would likely die out while organisms with favorable traits would pass on their traits via reproduction. In practice, likely due to the capped number of each organism allowed in the ecosystem, each species takes quite a few generations to find that equilibrium where healthy genetic mutation and variation can occur.

### Altered Movement Behaviors

Previously, organisms turned instantaneously towards stimuli like food and fellow species members. However, instantaneous turning is rather unrealistic and "jerky," especially during predator-prey chase situations. As such, I have implemented steering so that organisms that move must expend time (and energy) to turn towards target positions. This has indirect effects on predator-prey interactions; for example, an herby now has a small chance to evade a chasing pred by moving sideways, forcing the pred to keep its field-of-view vision on the herby.

I also implemented the ability for organisms to set and broadcast goals. When an organism finds food or wants to go to a certain location, it creates a goal. If the organism is high-energy, then other lower-energy organisms will follow the lead of the high-energy organism. For example, if a high-energy pred sets its sights on an herby, other lower-energy preds without goals will also converge on the herby.

This makes squad-based behaviors and tactics more complex during runtime without a significant increase in complexity of the implementation.

## Todo

- Density-based decision-making (i.e. organisms account for amount of food in one place when deciding where to move).
- More species with different archetypes (e.g. decomposers which eat corpses for energy).
- Alter goal system to use priority queue instead of singular value.