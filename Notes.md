### benefits of tsup? why use it instead of package exports?

#### so what works with package exports?

- it does work with hot update for existing files

#### what does not work with package exports?

- next server does not reload when there is a change in the package => not sure if this is related to exports

  - actually, i think it is related to nextjs
  - fixed

- does it work with new files? (not required to restart next server?)
  - yes (but need to reload typescript server)
