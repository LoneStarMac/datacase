// bellPrep.js (formerly prepTool.js)

let uploadedImage = null;
let uploadedJson = null;

function handleFileUpload(event, type) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        if (type === 'image') {
            uploadedImage = e.target.result;
            const canvas = document.getElementById('previewCanvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = uploadedImage;
        } else if (type === 'json') {
            uploadedJson = JSON.parse(e.target.result);
            document.getElementById('jsonEditor').value = JSON.stringify(uploadedJson, null, 2);
        }
    };

    if (type === 'image') reader.readAsDataURL(file);
    if (type === 'json') reader.readAsText(file);
}

function updateJsonFromEditor() {
    try {
        uploadedJson = JSON.parse(document.getElementById('jsonEditor').value);
        alert('JSON updated successfully!');
    } catch (e) {
        alert('Invalid JSON!');
    }
}

function addBoltHole() {
    const x = parseFloat(document.getElementById('boltX').value);
    const y = parseFloat(document.getElementById('boltY').value);
    const label = document.getElementById('boltLabel').value;

    if (!uploadedJson.bolt_holes) uploadedJson.bolt_holes = [];

    uploadedJson.bolt_holes.push({ label, x, y });
    document.getElementById('jsonEditor').value = JSON.stringify(uploadedJson, null, 2);
    alert('Bolt hole added!');
}

function generateSVG() {
    if (!uploadedImage || !uploadedJson) {
        alert('Please upload both image and JSON data.');
        return;
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", "600");
    svg.setAttribute("height", "400");

    const image = document.createElementNS(svgNS, "image");
    image.setAttributeNS(null, 'href', uploadedImage);
    image.setAttribute('width', 600);
    image.setAttribute('height', 400);
    svg.appendChild(image);

    if (uploadedJson.bolt_holes) {
        uploadedJson.bolt_holes.forEach((hole, i) => {
            const circle = document.createElementNS(svgNS, 'circle');
            circle.setAttribute('cx', hole.x);
            circle.setAttribute('cy', hole.y);
            circle.setAttribute('r', 5);
            circle.setAttribute('fill', 'red');
            circle.setAttribute('stroke', 'black');
            svg.appendChild(circle);

            const text = document.createElementNS(svgNS, 'text');
            text.setAttribute('x', hole.x + 6);
            text.setAttribute('y', hole.y);
            text.setAttribute('font-size', '12');
            text.textContent = hole.label || `B${i + 1}`;
            svg.appendChild(text);
        });
    }

    const serializer = new XMLSerializer();
    const svgBlob = new Blob([serializer.serializeToString(svg)], { type: 'image/svg+xml' });

    const zip = new JSZip();
    zip.file("bellhousing.svg", svgBlob);
    zip.file("bellhousing.json", JSON.stringify(uploadedJson, null, 2));

    zip.generateAsync({ type: "blob" })
        .then(function(content) {
            saveAs(content, "bellhousing_submission.zip");
        });
}
