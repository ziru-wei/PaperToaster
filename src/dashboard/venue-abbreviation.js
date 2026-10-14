// Short venue names for the dashboard. The track stays explicit, so a full paper
// ("CHI") never reads like an extended abstract ("CHI EA") or a workshop paper.

const VENUES = [
  // CHI PLAY and CHIIR are separate venues that share the CHI prefix.
  { name: "CHI PLAY", pattern: /\bCHI\s*PLAY\b|Computer-Human Interaction in Play/i },
  { name: "CHIIR", pattern: /\bCHIIR\b|Human Information Interaction and Retrieval/i },
  { name: "CHI", pattern: /\bCHI\b|Human Factors in Computing Systems/i },
  { name: "UIST", pattern: /\bUIST\b|User Interface Software and Technology/i },
  { name: "DIS", pattern: /\bDIS\b|Designing Interactive Systems/i },
  { name: "ISMAR", pattern: /\bISMAR\b|Mixed and Augmented Reality/i },
  { name: "CSCW", pattern: /\bCSCW\b|Computer[- ]Supported Cooperative Work/i },
  { name: "IUI", pattern: /\bIUI\b|Intelligent User Interfaces/i },
  { name: "IEEE VR", pattern: /\bIEEE\s*VR\b|IEEE Conference on Virtual Reality and 3D User Interfaces/i },
  { name: "NeurIPS", pattern: /\bNeurIPS\b|\bNIPS\b|Neural Information Processing Systems/i },
  { name: "ICLR", pattern: /\bICLR\b|International Conference on Learning Representations/i },
  { name: "ICML", pattern: /\bICML\b|International Conference on Machine Learning/i },
  { name: "CVPR", pattern: /\bCVPR\b|Computer Vision and Pattern Recognition/i },
  { name: "ICCV", pattern: /\bICCV\b|International Conference on Computer Vision/i },
  { name: "ECCV", pattern: /\bECCV\b|European Conference on Computer Vision/i }
];

// Checked in order: an extended abstract that mentions a workshop is still EA.
const TRACKS = [
  { name: "EA", pattern: /Extended Abstracts?|\bEA\b|Late[- ]Breaking/i },
  { name: "Adjunct", pattern: /\bAdjunct\b/i },
  { name: "Companion", pattern: /\bCompanion\b/i },
  { name: "Workshop", pattern: /\bWorkshops?\b/i },
  { name: "DC", pattern: /Doctoral Consortium/i },
  { name: "Poster", pattern: /\bPosters?\b/i },
  { name: "Demo", pattern: /\bDemos?\b|Demonstrations?/i }
];

export function abbreviateVenue(venue) {
  const value = String(venue || "").replace(/\s+/g, " ").trim();
  const known = VENUES.find((candidate) => candidate.pattern.test(value));
  if (!known) return value;
  const track = TRACKS.find((candidate) => candidate.pattern.test(value));
  return track ? `${known.name} ${track.name}` : known.name;
}
