# Ecosystem Assignment

[p5 DEMO](https://bennyboy.tech/RobotaPsyche/02-14/)

For this assignment, I decided to loosely model a barebones ecosystem with producers and primary/secondary consumers.

## Components

### Ecosystem

> See: [Env.js](Env.js)

The ecosystem governs and displays the actions of all organisms within. Time is measured in frames, where - barring slowdowns from computation/graphical lag - 60 frames equates to 1 second. The ecosystem also handles the cleanup of dead organisms.

### Organism

All organisms in the ecosystem rely on energy to survive and reproduce. In addition, all organisms have a biological clock that decreases over time. If energy falls to 0 or the biological clock runs out of time, then the organism dies. In a sense, the higher the energy level, the stronger the organism.

### Producer: Plant (Green Circle)

> See: [Plant.js](Plant.js)

The plant is a sedentary organism that can "photosynthesize" to self-generate energy over time. A plant generates 0.5 energy per frame up to 10 energy. Once over 5 energy, the plant can self-replicate and create a child plant; self-replication costs 1 energy for the parent plant. Each plant's biological clock is set to last 300-600 frames.

Due to its spawn mechanics, the plant tends to clump at the borders of the ecosystem, but with the help of herbies, populations of plants may suddenly shift through the center to opposite sides of the ecosystem.

### Primary Consumer: Herby (Blue Square)

> See: [Herby.js](Herby.js)

The herby is a large herbivore which eats plants for energy. An herby eats up to 1 energy per frame of plant to refill up to 160 energy. Herbies that are over 80 energy can reproduce with other herbies that are over 80 energy to create a child herby; each instance of reproduction costs half of the energy pool for both parent herbies. Each herby's biological clock lasts 3600-7200 frames. For self-defense, herbies can attack threats in their vicinity, dealing 0.1 damage per frame to energy and neutralizing weaker threats. Herbies can detect threats in a circular radius of 160 pixels; upon detecting a threat, the herby first attempts to flee before self-defending.

Despite their slow speed, herbies are extremely energy-efficient and have great stamina/endurance. Herbies tend to stay together in the packs, where weaker herbies follow stronger herbies to find food. This has the added benefit of giving weaker herbies the chance to escape being hunted, since preds tend to prioritize stronger herbies.

### Secondary Consumer: Pred (Red Triangle)

The pred is an agile, vicious carnivore which eats herbies for energy. A pred eats up to 4 energy per frame of herby to refill up to 40 energy. Preds that are over 20 energy can reproduce with other preds that are over 20 energy to create an offspring pred; each instance of reproduction costs half of the energy pool for both parent preds. Each pred's biological clock lasts 900-1800 frames. Preds detect prey in a 45-degree field-of-view; when a faraway prey enters the pred's FOV, the pred slowly stalks and approaches the prey. Once the prey reaches within 200 pixels of the pred, the pred immediately chases it down.

Thanks to its sheer speed, the pred can corner and take down fleeing herbies quickly and efficiently. This comes with a fickle trade-off, however; preds are rather energy-inefficient, often gambling their entire energy pool to chase a fleeing herby. To make taking down stronger herbies more manageable, preds tend to hunt in packs; in fact, larger preds will often prioritize reproducing to create smaller offspring that can move as an agile pack.

## Todo

- Momentum-based movement where organisms can move in one direction while conserving speed/energy.
- Genetic mixing and mutation for evolution and natural selection.
- Collision?
- Density-based decision-making (i.e. organisms account for amount of food in one place when deciding where to move).
- More species with different archetypes (e.g. decomposers which eat corpses for energy).