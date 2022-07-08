# Piano Trainer

A cross-platform utility for learning the piano

![Piano Trainer](https://i.imgur.com/k2y1Gr5.png)

## Features

- [x] MIDI compatible
- [x] Cross-platform support
- [x] Interactive scale practice
  - [x] Hard mode
- [x] Interactive chord practice
- [x] Interactive Circle of Fifths practice
- [x] Interactive fifths practice
- [x] Interactive quiz

## Coming Soon

- [ ] Computer keyboard support
- [ ] Interactive inversion practice
- [ ] Settings
  - [ ] Toggle questions in quiz mode
  - [ ] Change keyboard sound

# Releases

Download for free on all platforms on [itch.io/piano-trainer](https://zaneh.itch.io/piano-trainer)

or download the [latest build here](https://github.com/ZaneH/scale-trainer/releases)

## Run Locally

You'll need to setup Rust and Tauri CLI by following the [Getting Started guide here](https://tauri.app/v1/guides/getting-started/prerequisites).

```bash
$ git clone https://github.com/ZaneH/scale-trainer.git
$ cd scale-trainer
$ yarn && yarn tauri dev
```

## Build target binary

Outputs to `/src-tauri/target/release/bundle`

```bash
$ yarn tauri build
```

# Contributions

Contributions are more than welcome.

Create a PR pointing to the `dev` branch. Stable builds will be merged into `master`.

Code formatting is handled with Git Hooks.

# Credit

Special thank you to [ruohki/tauri-midi-example](https://github.com/ruohki/tauri-midi-example), [kevinsqi/react-piano](https://github.com/kevinsqi/react-piano), and the [Tauri Discord community](https://tauri.app/).
