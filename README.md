OUTPUT TO CHECK  the processed FNOL: curl -X POST "https://synapx-claimagent.onrender.com/upload-pdf" \
  -F "file=@C:/Users/YourName/Downloads/sample.pdf"     (///replace file with your FNOL file path) 

[ouputsynapx](https://github.com/user-attachments/assets/3fc7a930-ccbe-4d17-a9ce-07a480f544b6)
(check the above image for generated output).

Hey !This is a lightweight insurance claims processing agent that can read FNOL (First Notice of Loss) documents, extract important fields, check for missing information, classify the claim, and decide the correct workflow route.
It supports both:JSON input and PDF upload + auto extraction. 
I have developed using plain javascript and basic express and Regex (for pdf processor using ai tool).

Logic for this: I built my system by breaking everything into small, easy steps:

1. Read the input:
The system accepts:JSON dataor a PDF file (FNOL form) If it’s a PDF, I extract its text first.
Extract the important details

2. I wrote a function that picks out useful information like:Policy number ,Policyholder name,Date and time of the incident ... 
It’s like reading a form and copying the important parts.

3️.Check what is missing:The system checks if important details are empty or missing.
If anything mandatory is not found → the claim goes to Manual Review.

4️. Understand the claim:The description is analyzed to identify the type of claim:Injuries,Collisions..
This helps decide the next step.

5.Apply routing rules  I added simple rules:
If estimated damage < 25,000 → Fast-track
If any required field is missing → Manual Review
If description has fraud words (“staged”, “inconsistent”) → Investigation
If claim type = injury → Specialist Queue

