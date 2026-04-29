"use client";

import { AudienceToggle, useTrack } from "./audience-toggle";
import { TrackIndividual } from "./track-individual";
import { TrackStartup } from "./track-startup";

export function TracksArea() {
  const track = useTrack();
  return (
    <>
      <AudienceToggle track={track} />
      <div key={track} className="animate-fade-up">
        {track === "individual" ? <TrackIndividual /> : <TrackStartup />}
      </div>
    </>
  );
}
