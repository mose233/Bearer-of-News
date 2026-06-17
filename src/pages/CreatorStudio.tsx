




Pasted text(10).txt
Document


Pasted text(13).txt
Document
Already we have done this and you continue after this :Generate FULL safe ContentStudio.tsx preserving everything

I’ll give you a complete replacement now. This version keeps the working upload, preview, voice, background music, silent export, narrated export, final mixed MP4 export, Facebook share, and adds Phase 7J content-type templates. ....... :

Thought for 36s

Replace the whole src/pages/ContentStudio.tsx with this:

Now we move to the next phase ... This is what we have built 


Pasted text(14).txt
Document
Can you add for me to reduce any error for me to copy the whole file: 


Pasted text(15).txt
Document


Pasted text(16).txt
Document

1000002974.jpg
1000002973.jpg
1000002971.jpg
This is the early screen shots 


Pasted text(19).txt
Document



Pasted text(20).txt
Document

Thank you for the great work you have done ... But here you have repeated to warning on review ... Let us maintain only of Facebook 

Before we move to phase 3 ... Can you do this where a user posts his/her photo and post a song and her own song is generated


Pasted text(21).txt
Document
Add for me in order not to make any error for me to copy the whole file: 


Pasted text(22).txt
Document


Pasted text(23).txt
Document


Pasted text(24).txt
Document
Can you fix for me and I will copy the whole file: 


Pasted text(25).txt
Document


Pasted text(26).txt
Document


Pasted text(27).txt
Document


Pasted text(28).txt
Document


Pasted text(29).txt
Document


Pasted text(30).txt
Document

When I click generate video this is what it generates ... What is the problem? 


Pasted text(31).txt
Document


Pasted text(32).txt
Document


Pasted text(33).txt
Document


Pasted text(34).txt
Document


Pasted text(35).txt
Document


Pasted text(36).txt
Document


Pasted text(37).txt
Document


Pasted text(38).txt
Document

1000002751.jpg
1000002750.jpg


Pasted text(39).txt
Document
Please I always make errors ... Can you replace for me to copy the whole file: 

1000002999.jpg
1000002998.jpg
1000002997.jpg
1000002996.jpg
There are four warnings on Creator Studio AI page ... Why can't we keep only "Facebook Save-Reminder: ... "


Pasted text(40).txt
Document


Pasted text(41).txt
Document


Pasted text(42).txt
Document


Pasted text(43).txt
Document


Pasted text(44).txt
Document


Pasted text(45).txt
Document


Pasted text(46).txt
Document


Pasted text(47).txt
Document


Pasted text(48).txt
Document


Pasted text(50).txt
Document


Pasted text(51).txt
Document


Pasted text(52).txt
Document

Thank you for the great work .... Now there also another thing: when a user selects "like Picture AI; Photo Enhancer" the list just stays there even if you to the next along "selected tool workspace"  they all appear still there without being replaced with the selected action. I propose as you have done on the box "Write Your Idea; Video Type" where when you click "Video Type" and you select "Politics" the name politic only appear on the box alone


Pasted text(53).txt
Document

1000002751.jpg
1000002750.jpg
draft this Facebook verified letter it including the date and the Facebook collaboration as mention for Bearer of News biography 


Pasted text(55).txt
Document


This is the photo I want to appear there


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Collaborative Facebook Content Manager</title>
    <meta name="description" content="A Facebook-integrated platform that allows Page admins to collaborate with content creators, ensuring quality and compliance before final posting control." />
    <link rel="icon" type="image/svg+xml" href="/placeholder.svg" />

    <meta property="og:title" content="Collaborative Facebook Content Manager" />
    <meta property="og:description" content="A Facebook-integrated platform that allows Page admins to collaborate with content creators, ensuring quality and compliance before final posting control." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/og.jpg" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="/og.jpg" />
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>


Pasted text(56).txt
Document


Pasted text(57).txt
Document


Pasted text(58).txt
Document
I Have deleted package-lock.json but .... : 

I had given you package-lock.json can you bring forward for me to copy it

Pasted text(59).txt
Document


Pasted text(60).txt
Document


Pasted text(61).txt
Document
I have Replaced but still src/App.tsx has error ... please help me to fix them: 


Pasted text(62).txt
Document
but still: 


Pasted text(66).txt
Document


Pasted text(67).txt
Document
I have seen I can make errors ... can you fix it for me to copy the whole file:   


Pasted text(68).txt
Document


Pasted text(69).txt
Document


Pasted text(70).txt
Document
You know I always make error please replace for me and I will copy the whole file or I will download it: 

I was wondering why you wrote this ... "Canvas Editor ... xnewsapp.com ... Created with xnewsapp.com'


Pasted text(71).txt
Document
fix for me and give a download


Pasted text(72).txt
Document


Pasted text(73).txt
Document
fix for me please I copy the whole file: 


Pasted text(74).txt
Document


Pasted text(75).txt
Document

Pasted text (2).txt
Document


Pasted text(76).txt
Document


Pasted text(77).txt
Document


Pasted text(78).txt
Document
import React from "react";

type Props = {
  selectedTool: { category: string; tool: string } | null;
};

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827] p-6 text-white">
      <h3 className="text-xl font-extrabold">{title}</h3>
      <p className="mt-2 text-slate-300">{description}</p>
    </div>
  );
}

export default function DynamicToolWorkspace({ selectedTool }: Props) {
  if (!selectedTool) return null;
  const tool = selectedTool.tool;

  if (selectedTool.category === "Video AI") {
    switch (tool) {
      case "Text to Video Studio":
        return <Placeholder title="Text to Video Studio" description="Choose video type, write prompt, generate scenes, upload media, preview, and publish." />;
      case "Photo to Video":
        return <Placeholder title="Photo to Video" description="Upload photos, choose transitions, music, duration, and generate animated videos." />;
      case "Photo Music Video":
        return <Placeholder title="Photo Music Video" description="Create slideshow-style music videos from your photos." />;
      case "Talking Avatars":
        return <Placeholder title="Talking Avatars" description="Upload a photo, add script, choose voice and language, then generate a talking avatar." />;
      case "AI News Presenter":
        return <Placeholder title="AI News Presenter" description="Create AI presenter news videos from your scripts." />;
      case "Product Ad Generator":
        return <Placeholder title="Product Ad Generator" description="Upload product images, add product details, and generate ad videos." />;
      case "Dance Animation":
        return <Placeholder title="Dance Animation" description="Animate photos into dance videos." />;
      case "AI Music Video Studio":
        return <Placeholder title="AI Music Video Studio" description="Use AI Song Studio songs or upload MP3/WAV to create music videos." />;
      case "Story Generator":
        return <Placeholder title="Story Generator" description="Turn story ideas into short narrative videos." />;
      case "Birthday Video":
        return <Placeholder title="Birthday Video" description="Create birthday celebration videos with photos, messages, and music." />;
    }
  }
  return <Placeholder title={tool} description="Workspace ready." />;
}

Thank for your excellent work ... Now we look at Smart Canvas box which is longer than the other left side ... Can you reduce it's length to be the same as the left box 

This is also on the Cover page ... The left side is lower not on the same level as the right one ... Can you bring the left one up to be on the same level as the right one.


Pasted text(79).txt
Document

There is something I have noticed on Smart Canvas ... There is no defined space for "Your design preview appears here" ... Under you look keenly under that you can see letter seeming to appear ... Can you notice that?

You haven't returned it ... Look how messy it is 😭😭

This how it looks: 


Pasted text(80).txt
Document
this is where the problem started ... please fix it : 

Please can you enter "Live preview and timeline" to move to the right under "generate enhanced photo" and "Smart Canvas" move to the right 


Pasted text(81).txt
Document


Pasted text(82).txt
Document
Can you analyze these whether it has any help: 


Pasted text(83).txt
Document
can you see where it is ... number line: 


Pasted text(84).txt
Document

1000002751.jpg
1000002750.jpg
Can this assist to fix the problem for the user to post from xnewsapp.com directly on the his Facebook page 

You mean this one 

Is it the one 

My Facebook account is not opening 



1000003219.jpg
1000003218.jpg
Still it is publishing this:


Pasted text(100).txt
Document


Pasted text(101).txt
Document


Pasted code(9).ts
TypeScript
is it this one : 


Pasted code(10).ts
TypeScript


Pasted code(11).ts
TypeScript
don't mention fal.ai please develop/update as you did to ... Pick what you want to create. 


Picture AI
Images, photos & designs

▼

Video AI
Social videos

▼

Music AI
Songs & audio

▼

Cinematic AI
Premium motion ... :  




Pasted text(217).txt
Document


Pasted text(228).txt
Document

I found the problem.

The file you uploaded is not the one responsible for your download issue. 


This is AIVideoStudioPanel.tsx, and it's only a mock/demo UI.

Look at your Export button:

<Button
  className="rounded-2xl bg-slate-100 font-bold text-black hover:bg-white"
>
  <Download className="mr-2 h-4 w-4" />
  Export MP4
</Button>
There is no:

onClick={...}
There is no export function.

There is no download function.

There is no MP4 generation.

So when you click Export MP4, it literally does nothing except render a button. 


But...
Earlier you said:

"The video is generated and it shows downloading but it is not downloaded."

That cannot be coming from this file because this file never displays:

Downloading...
or

Exporting...
This tells me you're actually using a different video studio.

From everything we've built together, XNewsApp currently has two video studios:

✅ CreatorStudio (the real one)

⚠ AIVideoStudioPanel (the mock/demo one)

The "Downloading..." message comes from the real Creator Studio, not this mock panel.

We need the real export code
Please upload:

src/pages/CreatorStudio.tsx
or whichever file contains these functions:

handleExportPrimary()

handleExportSilentMp4()

handleExportNarratedMp4()
Those functions are what ExportPanel.tsx calls, and that's where the actual download logic lives.

I have a strong suspicion
Based on all the work we've done on XNewsApp, I think we'll find something like:

setExportStatus("Downloading...");
but the code never reaches:

const blob = ...
const url = URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = "xnewsapp-video.mp4";
a.click();
or the generated MP4 URL is empty.

Once you upload CreatorStudio.tsx, I expect we can fix this in one pass and get the MP4 download working.



Pasted text(229).txt
Document

I found the real reason. This is not a bug—it's because the download feature is intentionally disabled in your current code. 


Here's what's happening
When you click Download Media, ExportPanel calls:

handleExportPrimaryMedia()
That function checks the current media type.

If it's an image, it creates a preview video:

const videoBlob = await createAnimatedPreviewVideo(...)
saveAs(videoBlob, `xnewsapp-preview-${getTimelineDuration()}s.webm`)
So for images, it downloads a WEBM preview, not a real MP4. 


But when you try to export a real AI video, the code says:

const handleExportSilentMp4 = async () => {
  alert(
    "MP4 export is temporarily disabled while backend rendering is being connected..."
  );
};
and

const handleExportNarratedMp4 = async () => {
  alert(
    "Narrated MP4 export is temporarily disabled while backend rendering is being connected."
  );
};
There is no MP4 export implementation yet. 


Even more important
I also found this function:

const handleGenerateCompleteVideo = async () => {
  alert(
    "Complete AI video export is temporarily disabled..."
  );
};
That means the application never creates a final MP4 file. It only prepares scenes and previews. 


This explains your symptom
You said:

"The video is generated and it shows downloading but it is not downloaded."

The app is showing progress, but there is no real MP4 to download because the backend rendering hasn't been connected yet.

This is what I recommend
Don't spend time trying to patch the download button. Instead, implement the real export pipeline:

Prompt
      ↓
Generate AI scenes
      ↓
Generate AI video
      ↓
Receive final MP4 URL
      ↓
Download MP4
      ↓
Publish to Facebook
At the moment, your code stops before the "Receive final MP4 URL" step.

My proposal
I recommend we build a real Export Engine for XNewsApp that:

✅ Produces actual MP4 files (instead of placeholder WEBM previews).

✅ Downloads the finished MP4 reliably.

✅ Supports AI-generated videos from your chosen backend.

✅ Integrates directly with the Facebook publishing workflow you've been building.

✅ Falls back gracefully with clear error messages if generation or download fails.

That will solve the root problem instead of working around it. Based on the code you've shared, this is the missing piece that will make XNewsApp behave like a production AI creator platform rather than a prototype.


okay let us build it 

Yes. This is actually the right time to build it.

Based on everything we've built together over the past few months, I would not use browser-only FFmpeg anymore. It's slow, memory-intensive, and doesn't scale well for longer videos or mobile devices.

Instead, I'd build XNewsApp like a production AI platform.

Phase 1 — Real Export Engine
Creator Studio
       │
       ▼
Prepare Timeline
       │
       ▼
Create Export Job
       │
       ▼
Backend Renderer
       │
       ▼
MP4
       │
       ▼
Cloud Storage
       │
       ▼
Download
       │
       ▼
Publish to Facebook
Folder Structure
I'd add a new folder:

src/lib/export/

    exportVideo.ts
    exportImages.ts
    uploadAssets.ts
    renderTimeline.ts
    downloadVideo.ts
This keeps all export logic in one place instead of inside CreatorStudio.tsx.

Phase 2
Instead of

Image

↓

WEBM preview
we'll generate

Images
      ↓
Timeline
      ↓
Transitions
      ↓
Music
      ↓
Voice
      ↓
Captions
      ↓
1080p MP4
Exactly like Canva, CapCut and InVideo.

Phase 3
Your download button becomes

Download Media

↓

Preparing assets...

↓

Rendering...

↓

Uploading...

↓

Download MP4
instead of

Downloading...

...

Nothing
Phase 4
After rendering

video.mp4
we'll execute

saveAs(videoBlob, "xnewsapp-video.mp4");
or if rendered on the backend

window.location.href = downloadUrl;
Phase 5
Then Facebook

Download MP4

↓

Publish to Facebook Page

or

Download to device
I would also redesign ExportPanel
Instead of

Download Media
it becomes

Generate MP4
When finished

✓ MP4 Ready

Download MP4

Publish to Facebook

Copy Download Link
Even Better
I would build a Render Queue.

Exactly like professional editors.

Rendering

████████░░░░░░░

Scene 1 ✓

Scene 2 ✓

Voice ✓

Music ✓

Captions ✓

Encoding ✓

Uploading ✓

Finished
Users love seeing progress.

My recommendation
Since XNewsApp is becoming a serious AI Creator Platform, I recommend we stop patching the current export logic and build a proper export system in stages.

Step 1 (next)
Create:

src/lib/export/
with the first file:

downloadVideo.ts
Step 2
Create

renderTimeline.ts
Step 3
Create

exportVideo.ts
Step 4
Connect all of them to CreatorStudio.tsx.

This approach will give you a clean, maintainable architecture that supports not just today's features but future additions like 4K exports, watermarks, background rendering, and direct publishing. I think it's a much stronger foundation than continuing to expand the current export code.



Pasted code(13).ts
TypeScript

Pasted code (2)(1).ts
TypeScript
you remember Publish to Facebook gave us problems and we left it ... can I give you two file to check them out ... check these two file and she which is downloading properly : 

Yes—and after comparing the two files, I can confidently tell you which one should be the foundation for XNewsApp.

File 1 (newer version)
This file has all the export functions replaced with placeholder alerts:

handleExportSilentMp4()
alert("MP4 export is temporarily disabled...")
The same is true for:

handleExportNarratedMp4()

handleExportFinalMixedMp4()

handleGenerateCompleteVideo()

This version cannot export MP4s at all. It was intentionally simplified while waiting for a backend renderer. 


File 2 (older version)
This one contains a complete export pipeline.

It imports:

exportSilentMp4
exportNarratedMp4
exportFinalMixedMp4
exportPhotoMusicVideoMp4
and actually calls them. 


For example:

const videoBlob = await exportSilentMp4(...)
then

saveAs(videoBlob, "creator-studio-silent-video.mp4");
It also updates the preview so the exported video can be played immediately after rendering. 


So why doesn't it download?
The important point is:

File 2 is the correct architecture.

If clicking Download still doesn't produce a file, the problem is almost certainly not in CreatorStudio.tsx anymore.

The next place to inspect is:

src/lib/creator/videoExport.ts
because every export goes through:

exportSilentMp4(...)
or

exportNarratedMp4(...)
or

exportFinalMixedMp4(...)
If one of those functions:

throws an exception,

returns an empty Blob,

or returns something that isn't a valid MP4,

then saveAs() has nothing useful to save.

I think we've found the real source of the bug
Over the last few days we've been looking in:

❌ ExportPanel.tsx

❌ DynamicToolWorkspace.tsx

❌ CreatorStudio.tsx

Those files mainly coordinate the workflow.

The actual rendering engine is in:

src/lib/creator/videoExport.ts
That file determines whether a valid video blob is produced.

My recommendation
I recommend we stop modifying CreatorStudio.tsx for now.

Instead, let's inspect and repair:

src/lib/creator/videoExport.ts
That's where we'll be able to answer questions like:

Is FFmpeg actually producing an MP4?

Is it producing a WebM instead?

Is the returned Blob empty?

Is there an exception being swallowed?

Is saveAs() receiving valid data?

Once that file is correct, both the Download button and the future Publish to Facebook flow will have a solid foundation, because they'll both depend on the same, working video export pipeline.

I think this is the most efficient next step: fix the rendering engine first, then build Facebook publishing on top of a reliable MP4 export.

can I 

import React, { useEffect, useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import AiToolLauncher, {
AiToolSelection,
} from "@/components/creator/AiToolLauncher";
import DynamicToolWorkspace from "@/components/creator/DynamicToolWorkspace";
import PreviewPanel from "@/components/creator/PreviewPanel";
import PicturePreviewPanel from "@/components/creator/PicturePreviewPanel";
import ExportPanel from "@/components/creator/ExportPanel";

import { generateVoice } from "@/lib/voice";
import { generateSceneImage } from "@/lib/creator/imageGeneration";
import { generateDancingVideo, DanceStyle } from "@/lib/ai/videoProviders";
import {
generateMultiScenePlan,
MultiScenePlan,
} from "@/lib/creator/multiSceneGenerator";

import {
CreatorContentType,
generateCreatorContent,
} from "@/lib/creator/templates";

import { ImagePreviewItem } from "@/lib/creator/videoExport";

export default function CreatorStudio() {
const [videoPrompt, setVideoPrompt] = useState("");
const [facebookCaption, setFacebookCaption] = useState("");
const [contentType, setContentType] =
useState("general");

const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
const [isSpeaking, setIsSpeaking] = useState(false);
const [voiceText, setVoiceText] = useState("");
const [speechRate, setSpeechRate] = useState(1);
const [voiceVolume, setVoiceVolume] = useState(1);
const [aiVoiceBlob, setAiVoiceBlob] = useState<Blob | null>(null);

const [isRecording, setIsRecording] = useState(false);
const [isExporting, setIsExporting] = useState(false);
const [exportStatus, setExportStatus] = useState("");

const audioRef = useRef<HTMLAudioElement | null>(null);
const [backgroundMusic, setBackgroundMusic] = useState<File | null>(null);
const [musicPreview, setMusicPreview] = useState("");
const [isMusicPlaying, setIsMusicPlaying] = useState(false);
const [musicVolume, setMusicVolume] = useState(0.18);

const [mediaFiles, setMediaFiles] = useState<File[]>([]);
const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
const [sceneDurations, setSceneDurations] = useState<number[]>([]);

const [aiImagePrompt, setAiImagePrompt] = useState("");
const [generatedImageFile, setGeneratedImageFile] = useState<File | null>(
null
);
const [generatedImagePreview, setGeneratedImagePreview] = useState("");
const [isGeneratingImage, setIsGeneratingImage] = useState(false);
const [multiScenePlan, setMultiScenePlan] = useState<MultiScenePlan[]>([]);

const [photoMusicImageFile, setPhotoMusicImageFile] =
useState<File | null>(null);
const [photoMusicImagePreview, setPhotoMusicImagePreview] = useState("");
const [photoMusicAudioFile, setPhotoMusicAudioFile] =
useState<File | null>(null);
const [photoMusicAudioName, setPhotoMusicAudioName] = useState("");
const [photoMusicStyle, setPhotoMusicStyle] = useState("Music Video");
const [isExportingPhotoMusic, setIsExportingPhotoMusic] = useState(false);

const [dancingPhotoFile, setDancingPhotoFile] = useState<File | null>(null);
const [dancingPhotoPreview, setDancingPhotoPreview] = useState("");
const [danceStyle, setDanceStyle] = useState("Afrobeats");
const [isGeneratingDance, setIsGeneratingDance] = useState(false);
const [danceResultMessage, setDanceResultMessage] = useState("");

const [currentIndex, setCurrentIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(true);

const [selectedTool, setSelectedTool] =
useState<AiToolSelection | null>(null);
const [videoCreativeType, setVideoCreativeType] = useState("General");
const [videoOutputFormat, setVideoOutputFormat] = useState("Facebook Reel");
const [selectedVideoDurationSeconds, setSelectedVideoDurationSeconds] = useState(10);

const livePreviewSectionRef = useRef<HTMLDivElement | null>(null);
const workspaceSectionRef = useRef<HTMLDivElement | null>(null);

const handleSelectTool = (tool: AiToolSelection) => {
setSelectedTool(tool);

window.setTimeout(() => {
  workspaceSectionRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, 120);
};

const imagePreviews: ImagePreviewItem[] = useMemo(() => {
return mediaFiles
.map((file, index) => ({
file,
preview: mediaPreviews[index],
}))
.filter((item) => item.file.type.startsWith("image/"));
}, [mediaFiles, mediaPreviews]);

const mediaItems: ImagePreviewItem[] = useMemo(() => {
return mediaFiles
.map((file, index) => ({
file,
preview: mediaPreviews[index],
}))
.filter((item) => Boolean(item.preview));
}, [mediaFiles, mediaPreviews]);

useEffect(() => {
return () => {
mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

  if (musicPreview) URL.revokeObjectURL(musicPreview);
  if (generatedImagePreview) URL.revokeObjectURL(generatedImagePreview);
  if (photoMusicImagePreview) URL.revokeObjectURL(photoMusicImagePreview);
  if (dancingPhotoPreview) URL.revokeObjectURL(dancingPhotoPreview);

  window.speechSynthesis.cancel();
};
}, [
mediaPreviews,
musicPreview,
generatedImagePreview,
photoMusicImagePreview,
dancingPhotoPreview,
]);

useEffect(() => {
if (!isPlaying) return;
if (imagePreviews.length <= 1) return;

const currentDuration = sceneDurations[currentIndex] || getTimelineDuration();

const interval = setInterval(() => {
  setCurrentIndex((prev) =>
    prev === imagePreviews.length - 1 ? 0 : prev + 1
  );
}, currentDuration * 1000);

return () => clearInterval(interval);
}, [
isPlaying,
imagePreviews.length,
currentIndex,
sceneDurations,
selectedVideoDurationSeconds,
selectedTool?.category,
]);

useEffect(() => {
if (audioRef.current) {
audioRef.current.volume = musicVolume;
}
}, [musicVolume]);

const scrollToLivePreview = () => {
setTimeout(() => {
livePreviewSectionRef.current?.scrollIntoView({
behavior: "smooth",
block: "start",
});
}, 120);
};

const getTimelineDuration = () => {
return selectedVideoDurationSeconds || 10;
};

const createAnimatedPreviewVideo = async (
imageUrl: string,
durationSeconds: number
) => {
const canvas = document.createElement("canvas");
canvas.width = 720;
canvas.height = 1280;

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Could not create video canvas.");
}

const image = await new Promise<HTMLImageElement>((resolve, reject) => {
  const img = new Image();

  img.crossOrigin = "anonymous";
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = imageUrl;
});

const stream = canvas.captureStream(30);
const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
  ? "video/webm;codecs=vp9"
  : "video/webm";

const recorder = new MediaRecorder(stream, {
  mimeType,
});

const chunks: Blob[] = [];

recorder.ondataavailable = (event) => {
  if (event.data.size > 0) {
    chunks.push(event.data);
  }
};

const finished = new Promise<Blob>((resolve) => {
  recorder.onstop = () => {
    resolve(
      new Blob(chunks, {
        type: "video/webm",
      })
    );
  };
});

const startTime = performance.now();
const durationMs = Math.max(durationSeconds, 1) * 1000;

recorder.start();

const drawFrame = () => {
  const elapsed = performance.now() - startTime;
  const progress = Math.min(elapsed / durationMs, 1);
  const scale = 1 + progress * 0.12;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const imageRatio = image.width / image.height;
  const canvasRatio = canvas.width / canvas.height;

  let drawWidth = canvas.width;
  let drawHeight = canvas.height;

  if (imageRatio > canvasRatio) {
    drawHeight = canvas.height * scale;
    drawWidth = drawHeight * imageRatio;
  } else {
    drawWidth = canvas.width * scale;
    drawHeight = drawWidth / imageRatio;
  }

  const moveX = -canvas.width * 0.03 * progress;
  const moveY = -canvas.height * 0.03 * progress;

  const x = (canvas.width - drawWidth) / 2 + moveX;
  const y = (canvas.height - drawHeight) / 2 + moveY;

  ctx.drawImage(image, x, y, drawWidth, drawHeight);

  if (progress < 1) {
    requestAnimationFrame(drawFrame);
    return;
  }

  recorder.stop();
};

drawFrame();

return finished;
};

const addSceneToTimeline = (file: File, preview: string, duration = getTimelineDuration()) => {
const nextIndex = mediaFiles.length;

setMediaFiles((prev) => [...prev, file]);
setMediaPreviews((prev) => [...prev, preview]);
setSceneDurations((prev) => [...prev, duration]);
setCurrentIndex(nextIndex);

scrollToLivePreview();
};

const handleGenerateScript = () => {
if (!videoPrompt.trim()) {
alert("Please write a video prompt first.");
return;
}

const generated = generateCreatorContent(contentType, videoPrompt);

setFacebookCaption(generated.caption);
setVoiceText(generated.voice);
setAiVoiceBlob(null);

if (!aiImagePrompt.trim()) {
  setAiImagePrompt(videoPrompt);
}

alert("Script generated successfully.");
};

const handlePrepareTextToVideoPrompt = async () => {
const prompt = videoPrompt.trim();

if (!prompt) {
  alert("Please write a video prompt first.");
  return;
}

const enrichedPrompt = [
  `Creative type: ${videoCreativeType}`,
  `Output format: ${videoOutputFormat}`,
  prompt,
].join("\n");

try {
  setIsGeneratingImage(true);
  setExportStatus("Creating AI storyboard...");
  setAiImagePrompt(enrichedPrompt);

  const generated = generateCreatorContent(contentType, prompt);
  setFacebookCaption(generated.caption);
  setVoiceText(generated.voice);
  setAiVoiceBlob(null);

  const plan = generateMultiScenePlan(
enrichedPrompt,
getTimelineDuration()
);
setMultiScenePlan(plan);

  if (plan.length === 0) {
    alert("Storyboard could not be created. Please try a clearer idea.");
    return;
  }

  const startIndex = mediaFiles.length;
  const generatedFiles: File[] = [];
  const generatedPreviews: string[] = [];
  const generatedDurations: number[] = [];

  for (let index = 0; index < plan.length; index += 1) {
    const scene = plan[index];

    setExportStatus(
      `Generating scene image ${index + 1} of ${plan.length}...`
    );

    const result = await generateSceneImage(scene.prompt, "1024x1024");

    generatedFiles.push(result.file);
    generatedPreviews.push(result.previewUrl);
    generatedDurations.push(scene.duration || selectedVideoDurationSeconds);
  }

  setMediaFiles((prev) => [...prev, ...generatedFiles]);
  setMediaPreviews((prev) => [...prev, ...generatedPreviews]);
  setSceneDurations((prev) => [...prev, ...generatedDurations]);
  setCurrentIndex(startIndex);

  scrollToLivePreview();

  alert(
    `${plan.length} AI scene images generated and added to the timeline. You can now preview and export.`
  );
} catch (error) {
  console.error(error);
  alert("Failed to generate AI video draft scenes.");
} finally {
  setIsGeneratingImage(false);
  setExportStatus("");
}
};

const handlePhotoMusicPhotoUpload = (
e: React.ChangeEvent
) => {
const file = e.target.files?.[0];

if (!file) return;

if (photoMusicImagePreview) {
  URL.revokeObjectURL(photoMusicImagePreview);
}

const preview = URL.createObjectURL(file);

setPhotoMusicImageFile(file);
setPhotoMusicImagePreview(preview);
};

const handlePhotoMusicAudioUpload = (
e: React.ChangeEvent
) => {
const file = e.target.files?.[0];

if (!file) return;

setPhotoMusicAudioFile(file);
setPhotoMusicAudioName(file.name);
setBackgroundMusic(file);

if (musicPreview) {
  URL.revokeObjectURL(musicPreview);
}

const preview = URL.createObjectURL(file);

setMusicPreview(preview);
setIsMusicPlaying(false);
};

const handleAddPhotoMusicSceneToTimeline = () => {
if (!photoMusicImageFile || !photoMusicImagePreview) {
alert("Please upload a photo first.");
return;
}

addSceneToTimeline(photoMusicImageFile, photoMusicImagePreview, selectedVideoDurationSeconds);

alert("Photo music video scene added to timeline.");
};

const handleExportPhotoMusicVideo = async () => {
alert(
"Video download is temporarily disabled while backend rendering is being connected. You can still preview your media and download images."
);
};

const handleDancingPhotoUpload = (
e: React.ChangeEvent
) => {
const file = e.target.files?.[0];

if (!file) return;

if (dancingPhotoPreview) {
  URL.revokeObjectURL(dancingPhotoPreview);
}

const preview = URL.createObjectURL(file);

setDancingPhotoFile(file);
setDancingPhotoPreview(preview);
setDanceResultMessage("");
};

const handleGenerateDancingVideo = async () => {
try {
if (!dancingPhotoFile || !dancingPhotoPreview) {
alert("Please upload a dancing photo first.");
return;
}

  setIsGeneratingDance(true);
  setExportStatus("Generating mock dancing video...");

  const result = await generateDancingVideo({
    imageFile: dancingPhotoFile,
    imagePreview: dancingPhotoPreview,
    danceStyle,
  });

  setDanceResultMessage(result.message);

  addSceneToTimeline(
    dancingPhotoFile,
    dancingPhotoPreview,
    selectedVideoDurationSeconds
  );

  alert("Mock dancing video added to timeline.");
} catch (error) {
  console.error(error);
  alert("Failed to generate dancing video.");
} finally {
  setIsGeneratingDance(false);
  setExportStatus("");
}
};

const handleMediaUpload = (e: React.ChangeEvent) => {
const files = Array.from(e.target.files || []);

if (files.length === 0) return;

mediaPreviews.forEach((url) => URL.revokeObjectURL(url));

const previews = files.map((file) => URL.createObjectURL(file));

setMediaFiles(files);
setMediaPreviews(previews);
setSceneDurations(files.map(() => getTimelineDuration()));
setCurrentIndex(0);
};

const handleGenerateImage = async () => {
try {
const prompt = aiImagePrompt.trim() || videoPrompt.trim();

  if (!prompt) {
    alert("Please write an AI image prompt first.");
    return;
  }

  setIsGeneratingImage(true);
  setMultiScenePlan([]);

  const result = await generateSceneImage(prompt, "1024x1024");

  if (generatedImagePreview) {
    URL.revokeObjectURL(generatedImagePreview);
  }

  setGeneratedImageFile(result.file);
  setGeneratedImagePreview(result.previewUrl);

  alert("AI scene image generated successfully.");
} catch (error) {
  console.error(error);
  alert("Failed to generate AI scene image.");
} finally {
  setIsGeneratingImage(false);
}
};

const handleGenerateMultiScenePlan = () => {
try {
const prompt = aiImagePrompt.trim() || videoPrompt.trim();

  if (!prompt) {
    alert("Please write a prompt first.");
    return;
  }

  if (generatedImagePreview) {
    URL.revokeObjectURL(generatedImagePreview);
  }

  setGeneratedImageFile(null);
  setGeneratedImagePreview("");

  const plan = generateMultiScenePlan(
prompt,
getTimelineDuration()
);

  setMultiScenePlan(plan);

  alert("4-scene plan generated.");
} catch (error) {
  console.error(error);
  alert("Failed to generate scene plan.");
}
};

const handleGenerateSceneFromPlan = async (index: number) => {
try {
const scene = multiScenePlan[index];

  if (!scene) {
    alert("Scene not found.");
    return;
  }

  setIsGeneratingImage(true);

  const result = await generateSceneImage(scene.prompt, "1024x1024");

  addSceneToTimeline(result.file, result.previewUrl, scene.duration);

  alert(`Scene ${index + 1} added to timeline.`);
} catch (error) {
  console.error(error);
  alert("Failed to generate scene.");
} finally {
  setIsGeneratingImage(false);
}
};

const handleGenerateAllScenesFromPlan = async () => {
try {
if (multiScenePlan.length === 0) {
alert("Please generate a scene plan first.");
return;
}

  setIsGeneratingImage(true);

  for (const scene of multiScenePlan) {
    const result = await generateSceneImage(scene.prompt, "1024x1024");

    setMediaFiles((prev) => [...prev, result.file]);
    setMediaPreviews((prev) => [...prev, result.previewUrl]);
    setSceneDurations((prev) => [...prev, scene.duration]);
  }

  setCurrentIndex(mediaFiles.length);

  alert("All scenes generated and added to timeline.");
} catch (error) {
  console.error(error);
  alert("Failed to generate all scenes.");
} finally {
  setIsGeneratingImage(false);
}
};

const handleAddGeneratedImage = () => {
if (!generatedImageFile || !generatedImagePreview) {
alert("Please generate an AI scene image first.");
return;
}

addSceneToTimeline(
  generatedImageFile,
  generatedImagePreview,
  selectedVideoDurationSeconds
);

setGeneratedImageFile(null);
setGeneratedImagePreview("");

alert("AI image added to video timeline.");
};

const handleDeleteScene = (index: number) => {
const previewToDelete = mediaPreviews[index];

if (previewToDelete) {
  URL.revokeObjectURL(previewToDelete);
}

const nextFiles = mediaFiles.filter((_, itemIndex) => itemIndex !== index);
const nextPreviews = mediaPreviews.filter(
  (_, itemIndex) => itemIndex !== index
);
const nextDurations = sceneDurations.filter(
  (_, itemIndex) => itemIndex !== index
);

setMediaFiles(nextFiles);
setMediaPreviews(nextPreviews);
setSceneDurations(nextDurations);

setCurrentIndex((prev) => {
  if (nextFiles.length === 0) return 0;
  if (prev >= nextFiles.length) return nextFiles.length - 1;
  return prev;
});
};

const handleDuplicateScene = (index: number) => {
const fileToCopy = mediaFiles[index];
const previewToCopy = mediaPreviews[index];

if (!fileToCopy || !previewToCopy) return;

setMediaFiles((prev) => [
  ...prev.slice(0, index + 1),
  fileToCopy,
  ...prev.slice(index + 1),
]);

setMediaPreviews((prev) => [
  ...prev.slice(0, index + 1),
  previewToCopy,
  ...prev.slice(index + 1),
]);

setSceneDurations((prev) => [
  ...prev.slice(0, index + 1),
  prev[index] || selectedVideoDurationSeconds || 10,
  ...prev.slice(index + 1),
]);

setCurrentIndex(index + 1);
};

const handleUpdateSceneDuration = (index: number, duration: number) => {
const safeDuration = Math.min(Math.max(duration || 1, 1), 60);

setSceneDurations((prev) => {
  const next = [...prev];
  next[index] = safeDuration;
  return next;
});
};

const handleMusicUpload = (e: React.ChangeEvent) => {
const file = e.target.files?.[0];

if (!file) return;

if (musicPreview) {
  URL.revokeObjectURL(musicPreview);
}

const preview = URL.createObjectURL(file);

setBackgroundMusic(file);
setMusicPreview(preview);
setIsMusicPlaying(false);
};

const toggleMusic = () => {
if (!audioRef.current) return;

if (isMusicPlaying) {
  audioRef.current.pause();
  setIsMusicPlaying(false);
  return;
}

audioRef.current.volume = musicVolume;

audioRef.current
  .play()
  .then(() => setIsMusicPlaying(true))
  .catch((error) => {
    console.error(error);
    alert("Failed to play background music.");
  });
};

const startVoiceover = () => {
if (!voiceText.trim()) {
alert("Please type voice text first.");
return;
}

window.speechSynthesis.cancel();

const utterance = new SpeechSynthesisUtterance(voiceText);

utterance.rate = speechRate;
utterance.onstart = () => setIsSpeaking(true);
utterance.onend = () => setIsSpeaking(false);
utterance.onerror = () => setIsSpeaking(false);

speechRef.current = utterance;
window.speechSynthesis.speak(utterance);
};

const stopVoiceover = () => {
window.speechSynthesis.cancel();
setIsSpeaking(false);
};

const generateRealVoice = async () => {
try {
if (!voiceText.trim()) {
alert("Please type voice text first.");
return;
}

  setIsExporting(true);
  setExportStatus("Generating AI voice...");

  const audioBlob = await generateVoice(voiceText);

  setAiVoiceBlob(audioBlob);

  saveAs(audioBlob, "creator-studio-voiceover.mp3");

  alert("AI voice generated successfully!");
} catch (error) {
  console.error(error);
  alert("Failed to generate AI voice.");
} finally {
  setIsExporting(false);
  setExportStatus("");
}
};

const openFacebookAfterExport = () => {
window.open(
"https://www.facebook.com/",
"_blank",
"noopener,noreferrer"
);
};

const initializeFFmpeg = async () => {
alert(
"FFmpeg browser export has been removed for now. Video rendering will be handled by backend AI/rendering services later."
);
};

const handleExportPrimaryMedia = async () => {
if (selectedTool?.category === "Picture AI") {
if (generatedImageFile || generatedImagePreview) {
await handleDownloadGeneratedImage();
return;
}

  const currentPreview = mediaPreviews[currentIndex];
  const currentFile = mediaFiles[currentIndex];

  if (currentPreview && currentFile?.type.startsWith("image/")) {
    const response = await fetch(currentPreview);
    const blob = await response.blob();

    saveAs(blob, currentFile.name || "xnewsapp-image.png");
    return;
  }

  if (imagePreviews.length > 0) {
    const fallbackPreview = imagePreviews[0];

    const response = await fetch(fallbackPreview.preview);
    const blob = await response.blob();

    saveAs(blob, fallbackPreview.file.name || "xnewsapp-image.png");
    return;
  }

  alert("Please generate or add an image first.");
  return;
}

const currentFile = mediaFiles[currentIndex];
const currentPreview = mediaPreviews[currentIndex];

if (!currentFile || !currentPreview) {
  alert("Please upload or generate media first.");
  return;
}

if (currentFile.type.startsWith("video/")) {
  saveAs(currentFile, currentFile.name || "xnewsapp-video.mp4");
  return;
}

if (currentFile.type.startsWith("image/")) {
  try {
    setIsExporting(true);
    setExportStatus("Creating preview video download...");

    const videoBlob = await createAnimatedPreviewVideo(
      currentPreview,
      getTimelineDuration()
    );

    saveAs(
      videoBlob,
      `xnewsapp-preview-${getTimelineDuration()}s.webm`
    );
    return;
  } catch (error) {
    console.error(error);
    alert("Failed to create video download. Downloading image instead.");
    saveAs(currentFile, currentFile.name || "xnewsapp-image.png");
    return;
  } finally {
    setIsExporting(false);
    setExportStatus("");
  }
}

saveAs(currentFile, currentFile.name || "xnewsapp-media");
};

const handleExportSilentMp4 = async () => {
alert(
"MP4 export is temporarily disabled while backend rendering is being connected. Use Download Media for now."
);
};

const handleExportNarratedMp4 = async () => {
alert(
"Narrated MP4 export is temporarily disabled while backend rendering is being connected."
);
};

const handleExportFinalMixedMp4 = async () => {
alert(
"Final mixed MP4 export is temporarily disabled while backend rendering is being connected."
);
};

const handleGenerateCompleteVideo = async () => {
alert(
"Complete AI video export is temporarily disabled while backend rendering is being connected. You can still prepare scenes, preview, and download uploaded/generated media."
);
};

const handleDownloadGeneratedImage = async () => {
if (generatedImageFile) {
saveAs(generatedImageFile, "xnewsapp-ai-image.png");
return;
}

if (!generatedImagePreview) {
  alert("Please generate an image first.");
  return;
}

const response = await fetch(generatedImagePreview);
const blob = await response.blob();
saveAs(blob, "xnewsapp-ai-image.png");
};

return (




Creator Studio


      <h1 className="max-w-4xl text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl">
        Create AI videos, images and music
      </h1>

      <p className="mt-2 max-w-3xl text-xs font-medium leading-5 text-slate-300 sm:text-sm">
        Choose a tool, create your media, then export and download.
      </p>
    </header>

    <div className="mb-5">
      <AiToolLauncher
        selectedTool={selectedTool}
        onSelectTool={handleSelectTool}
      />
    </div>

    <div ref={workspaceSectionRef} className="mb-5 scroll-mt-4">
      <DynamicToolWorkspace
        selectedTool={selectedTool}
        speechRate={speechRate}
        setSpeechRate={setSpeechRate}
        voiceVolume={voiceVolume}
        setVoiceVolume={setVoiceVolume}
        isSpeaking={isSpeaking}
        aiVoiceBlob={aiVoiceBlob}
        isExporting={isExporting}
        onPlayVoiceover={startVoiceover}
        onStopVoiceover={stopVoiceover}
        onGenerateRealVoice={generateRealVoice}
        backgroundMusic={backgroundMusic}
        musicPreview={musicPreview}
        musicVolume={musicVolume}
        setMusicVolume={setMusicVolume}
        isMusicPlaying={isMusicPlaying}
        audioRef={audioRef}
        onMusicUpload={handleMusicUpload}
        onToggleMusic={toggleMusic}
        photoMusicImagePreview={photoMusicImagePreview}
        photoMusicAudioName={photoMusicAudioName}
        photoMusicStyle={photoMusicStyle}
        isExportingPhotoMusic={isExportingPhotoMusic}
        setPhotoMusicStyle={setPhotoMusicStyle}
        onPhotoMusicPhotoUpload={handlePhotoMusicPhotoUpload}
        onPhotoMusicAudioUpload={handlePhotoMusicAudioUpload}
        onAddPhotoMusicSceneToTimeline={handleAddPhotoMusicSceneToTimeline}
        onExportPhotoMusicVideo={handleExportPhotoMusicVideo}
        dancingPhotoPreview={dancingPhotoPreview}
        danceStyle={danceStyle}
        isGeneratingDance={isGeneratingDance}
        danceResultMessage={danceResultMessage}
        setDanceStyle={setDanceStyle}
        onDancingPhotoUpload={handleDancingPhotoUpload}
        onGenerateDance={handleGenerateDancingVideo}
        videoPrompt={videoPrompt}
        setVideoPrompt={setVideoPrompt}
        videoCreativeType={videoCreativeType}
        setVideoCreativeType={setVideoCreativeType}
        videoOutputFormat={videoOutputFormat}
        setVideoOutputFormat={setVideoOutputFormat}
        onPrepareTextToVideoPrompt={handlePrepareTextToVideoPrompt}
        aiImagePrompt={aiImagePrompt}
        setAiImagePrompt={setAiImagePrompt}
        isGeneratingImage={isGeneratingImage}
        generatedImagePreview={generatedImagePreview}
        multiScenePlan={multiScenePlan}
        onGenerateImage={handleGenerateImage}
        onGenerateMultiScenePlan={handleGenerateMultiScenePlan}
        onAddGeneratedImage={handleAddGeneratedImage}
        onGenerateSceneFromPlan={handleGenerateSceneFromPlan}
        onGenerateAllScenesFromPlan={handleGenerateAllScenesFromPlan}
        onMediaUpload={handleMediaUpload}
        onPublishToFacebook={openFacebookAfterExport}
        onDownloadGeneratedImage={handleDownloadGeneratedImage}
        onAddEnhancedPhotoToTimeline={(file, preview, durationSeconds) =>
          addSceneToTimeline(
            file,
            preview,
            durationSeconds || getTimelineDuration()
          )
        }
        onVideoDurationChange={setSelectedVideoDurationSeconds}
      />
    </div>

    <div className="grid grid-cols-1 gap-4">
      <section ref={livePreviewSectionRef} className="space-y-4">
        <Card className="rounded-[1.25rem] border border-white/10 bg-[#111827] text-white shadow-creator">
          <CardHeader className="border-b border-white/10 px-3 py-3 sm:px-4">
            <CardTitle className="text-sm font-semibold text-slate-200">
              Preview
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3 py-4 sm:px-4">
            {selectedTool?.category === "Picture AI" ? (
              <PicturePreviewPanel
                mediaFiles={mediaFiles}
                imagePreviews={imagePreviews}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                facebookCaption={facebookCaption}
              />
            ) : (
              <PreviewPanel
                mediaFiles={mediaFiles}
                imagePreviews={imagePreviews}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                facebookCaption={facebookCaption}
                sceneDurations={sceneDurations}
                onDeleteScene={handleDeleteScene}
                onDuplicateScene={handleDuplicateScene}
                onUpdateSceneDuration={handleUpdateSceneDuration}
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[1.25rem] border border-white/10 bg-[#111827] text-white shadow-creator">
          <CardHeader className="border-b border-white/10 px-3 py-3 sm:px-4">
            <CardTitle className="text-sm font-semibold text-slate-200">
              Export & Download
            </CardTitle>
          </CardHeader>

          <CardContent className="px-3 py-4 sm:px-4">
<ExportPanel
isRecording={isRecording}
isExporting={isExporting}
exportStatus={exportStatus}
exportPrimaryLabel={
selectedTool?.category === "Picture AI"
? "Download Image"
: "Download Media"
}
onExportPrimary={handleExportPrimaryMedia}
onOpenFacebook={openFacebookAfterExport}
onInitializeFFmpeg={initializeFFmpeg}
onExportSilentMp4={handleExportSilentMp4}
onExportNarratedMp4={handleExportNarratedMp4}
/>



        <div className="rounded-[1.25rem] border border-amber-400/20 bg-amber-400/10 p-3 text-[11px] font-medium leading-5 text-amber-100">
          Review your content before downloading or sharing.
        </div>
      </section>
    </div>

  </div>
</main>
);
}


Close
