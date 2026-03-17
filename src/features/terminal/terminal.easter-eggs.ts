// src/features/terminal/terminal.easter-eggs.ts

export const MAN_PAGE = `
AGUS-DARMAWAN(1)          Developer Manual          AGUS-DARMAWAN(1)

NAME
    agus-darmawan - Full-Stack & Robotics Developer

SYNOPSIS
    agus [--hire] [--collaborate] [--coffee]

DESCRIPTION
    Computer Engineering graduate from ITS (2025).
    Builds things that move (robots) and things that
    don't crash (web apps). Usually found debugging
    ROS nodes at 2AM or obsessing over TypeScript.

    Currently working on quadruped inspection robots
    for electrical substations and iOS apps at Apple
    Developer Academy Indonesia.

EXPERIENCE
    PT. Ezra Robotics Teknologi    Nov 2025 - Present
    Apple Developer Academy        Feb 2025 - Dec 2025
    B401 Robotics Laboratory       Jun 2024 - Aug 2025
    Barunastra ITS Roboboat        Apr 2022 - Nov 2024

    Run: open experience

TECHNICAL SKILLS
    Languages    TypeScript, Python, C++, Swift
    Frontend     React, Next.js, SwiftUI
    Backend      Node.js, AdonisJS, PostgreSQL
    Robotics     ROS/ROS2, OpenCV, YOLO, Gazebo
    Infra        Docker, Cloudflare, Vercel

AWARDS
    Grand Champion  IRC 2023 (International)
    1st Place       KKI 2022 & 2023 (National)
    1st Place       ICAVETS 2022 (International)

KNOWN BUGS
    Cannot stop adding features to side projects.
    Occasionally over-engineers simple solutions.
    Allergic to improperly typed TypeScript.
    Forgets to eat when debugging.

FILES
    ~/.bashrc         Shell configuration
    ~/projects/       Active projects
    ~/documents/      Resume and docs

SEE ALSO
    github(1), linkedin(1), coffee(∞)

    https://github.com/agus-darmawan
    https://linkedin.com/in/agusdarmawnn
    mailto:darmawandeveloper@gmail.com

AUTHOR
    I Wayan Agus Darmawan <darmawandeveloper@gmail.com>
    Denpasar, Bali, Indonesia

AGUS-DARMAWAN(1)                                AGUS-DARMAWAN(1)
`.trim();

export const SUDO_RESPONSES = [
	"Nice try. Permission denied.",
	"sudo: you don't have permission to hire me without scheduling a call first.",
	"sudo: command not found — try: contact --email",
	"[sudo] password for recruiter: *** INCORRECT ***",
];

export const RM_RF_RESPONSE = `rm: cannot remove '/': Permission denied
rm: it looks like you're trying to delete the portfolio
rm: that would be bad. aborting.
rm: also, who hurt you?`;

export const COWSAY_DEFAULT = `
 ______
< Moo! >
 ------
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`.trim();

export const NEOFETCH_OUTPUT = `
            .-/+oossssoo+/-.               agus@ubuntu
        \`:+ssssssssssssssssss+:\`           ─────────────────────────
      -+ssssssssssssssssssyyssss+-         OS: Ubuntu 22.04.3 LTS x86_64
    .ossssssssssssssssssdMMMNysssso.       Kernel: 5.15.0-91-generic
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Shell: bash 5.1.16
  +ssssssssshmydMMMMMMMNddddyssssssss+     Terminal: Portfolio Term
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    CPU: Intel i7-12700K @ 5GHz
.ssssssssdMMMNhssssssssshNMMMdssssssss.   Memory: 32GB
+sssshhhyNMMNyssssssssssyNMMMysssssss+    Languages: TypeScript Go Python
ossyNMMMNyMMhsssssssssssshmmmhssssssso    Frameworks: Next.js React ROS2
ossyNMMMNyMMhsssssssssssshmmmhssssssso    Awards: Grand Champion IRC 2023
+sssshhhyNMMNyssssssssssyNMMMysssssss+    
.ssssssssdMMMNhssssssssshNMMMdssssssss.   
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/   
  +ssssssssshmydMMMMMMMNddddyssssssss+    
   /ssssssssssshdmmNNmmyNMMMMhssssss/     
    .ossssssssssssssssssdMMMNysssso.      
      -+ssssssssssssssssssyyssss+-        
        \`:+ssssssssssssssssss+:\`          
            .-/+oossssoo+/-.`.trim();
