
var canvasWidth =window.innerWidth * 0.9;
var canvasHeight = window.innerHeight * 0.9;
fetch('./data/embeddings.json').then((response) => response.json()).then((embeddings) => {

    embeddings.forEach(embedding => {
        var newPosition = embedding.pos;
        newPosition[0] = newPosition[0] * canvasWidth/1.5;
        newPosition[1] = newPosition[1] * canvasWidth/2.2;
        newPosition[0] += canvasWidth/4;
        newPosition[1] += canvasHeight/8;
        var embeddingColor = newPosition[2] ;
        
       var embeddingElement=   document.createElement("div");
         embeddingElement.style.position = "absolute";
            embeddingElement.style.left = newPosition[0] + "px";
            embeddingElement.style.top = newPosition[1] + "px";
            embeddingElement.style.width = "10px";
            embeddingElement.style.height = "10px";
            embeddingElement.style.backgroundColor = "hsl(" + embeddingColor * 360 + ",100%,50%)";
            embeddingElement.style.borderRadius = "50%";
            embeddingElement.className = "tooltip";
            embeddingElement.style.cursor = "pointer";
            embeddingElement.onclick = "";
            var tooltip = document.createElement("span");
            tooltip.className = "tooltiptext";
            tooltip.innerHTML = embedding.text;
            tooltip.style.backgroundColor = "hsl(" + embeddingColor * 360 + ",100%,50%)";
             embeddingElement.appendChild(tooltip);
            document.body.appendChild(embeddingElement);

    });
});