/* De inicio é necessário selecionar uma imagem atraves do botao "selecionar imagem".
   Ao selecionar a imagem aparecerá as opções logo embaixo.

    OS PRIMEIRO 2 BOTÕES SERIA 
   -SUAVIZAÇÃO COM MEDIANA
   -SUAVIZAÇÃO COM MEDIA

   OS PRÓXIMOS 2 BOTÕES SERIA
   -CONVERSÃO EM TONS DE CINZA MÉDIA
   -CONVERSÃO EM TONS DE CINZA NTSC

   O PRÓXIMO BOTÃO SERIA
   -LIMIAR (BINARIZAÇÃO) MANUAL

   OS PROXIMOS 3 BOTÕES SERIA
   -GIRAR 90°
   -GIRAR 180°
   -GIRAR 270°

   OS PRÓXIMOS 2 BOTÕES SERIA
   -RETORNAR AO ANGULO ORIGINAL
   -RESTAURAR IMAGEM


    Filtros e algoritmos 
    CONCLUIDOS - (S) 
    NÃO FINALIZADOS - (N)
    N -Desfoque gaussiano (Gaussian Blur)
    S- Suavização com Média e Mediana
    S - Conversão em tons de cinza (Média e NTSC)
    S -Limiar (Binarização) manual
    S -Girar a imagem (90º, 180º, 270º)
    N -Redimensionar a imagem (4X, 2X, 1/2 e 1/4)

    Os algoritmos do redimensionamento foi inserido, mas por algum motivo não está sendo possivel
    ser aplicado na imagem.


*/
const photoFile = document.getElementById('photo-file')
let photoPreview = document.getElementById('photo-preview')
let image;
let photoName;


// seleção e preview
document.getElementById('select-image')
.onclick = function() {
    photoFile.click()
}

window.addEventListener('DOMContentLoaded', () =>{
    photoFile.addEventListener('change', () => {
        let file = photoFile.files.item(0)
        photoName = file.name;

        // ler um arquivo
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = function(event) {
            image = new Image();
            image.src = event.target.result
            image.onload = onLoadImage

            rotateButton0.style.display ='initial'
            rotateButton90.style.display ='initial'
            rotateButton180.style.display ='initial'
            rotateButton270.style.display ='initial'
            grayScaleNTSC.style.display = 'initial'
            reload.style.display = 'initial'
            medianSuavization.style.display = 'initial'
            meanSuavization.style.display = 'initial'
            limirizacao.style.display = 'initial'
            grayScaleMean.style.display = 'initial'
        }
    })
})


// Canvas
let canvas = document.createElement('canvas')
let ctx = canvas.getContext('2d')

function onLoadImage() {
    const { width, height } = image
    canvas.width = width;
    canvas.height = height;

    // limpar o ctx
    ctx.clearRect(0, 0, width, height)

    // desenhar a imagem no ctx
    ctx.drawImage(image, 0, 0)

    photoPreview.src = canvas.toDataURL()
}
    function HSLToRGB(h,s,l) {
        s /= 100;
        l /= 100;
      
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c/2,
            r = 0,
            g = 0,
            b = 0;
      
        if (0 <= h && h < 60) {
          r = c; g = x; b = 0;  
        } else if (60 <= h && h < 120) {
          r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
          r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
          r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
          r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
          r = c; g = 0; b = x;
        }
      
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);
      
        return new Array(r, g, b);
    } 
    function rgbToHsl(c) {
        var r = c[0]/255, g = c[1]/255, b = c[2]/255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
      
        if(max == min) {
          h = s = 0; // achromatic
        } else {
          var d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return new Array(h * 360, s * 100, l * 100);
    }
    
    class RGBColor {
        constructor(r, g, b) {
          this.red = r;
          this.green = g; 
          this.blue = b;
        }
    }
    
    class MatrixImage {
        constructor(imageData) {
          this.imageData = imageData;
          this.height = imageData.height; 
          this.width = imageData.width;
        }
    
        getPixel(x, y) {
            let position = ((y * (this.width * 4)) + (x * 4));
    
            return new Array(
                this.imageData.data[position],   //red
                this.imageData.data[position+1], //green
                this.imageData.data[position+2], //blue
            );
        }
    
        setPixel(x, y, color) {
            let position = ((y * (this.width * 4)) + (x * 4));
            this.imageData.data[position] = color.red;
            this.imageData.data[position+1] = color.green;
            this.imageData.data[position+2] = color.blue;
        }
    }
// Filtros (Mediana)
const medianSuavization = document.getElementById('medianSuavization')
medianSuavization.onclick = function(){
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let img = new MatrixImage(imageData);
        for (var i = 1; i < img.width+1; i++) {       
            for (var j = 1; j < img.height+1; j++) {   
    
                var px = Array();
                px.push(rgbToHsl(img.getPixel(i-1,j-1)));
                px.push(rgbToHsl(img.getPixel(i-1,j)));
                px.push(rgbToHsl(img.getPixel(i-1,j+1)));
    
                px.push(rgbToHsl(img.getPixel(i,j-1)));
                px.push(rgbToHsl(img.getPixel(i,j)));
                px.push(rgbToHsl(img.getPixel(i,j+1)));
    
                px.push(rgbToHsl(img.getPixel(i+1,j-1)));
                px.push(rgbToHsl(img.getPixel(i+1,j)));
                px.push(rgbToHsl(img.getPixel(i+1,j-1)));
    
                var h = Array();
                var s = Array();
                var l = Array();
    
                for (let index = 0; index < px.length; index++) {
                    h.push(px[index][0]);
                    s.push(px[index][1]); 
                    l.push(px[index][2]); 
                }
    
                function sortfunction(a, b){
                    return (a - b)
                }
    
                h.sort(sortfunction);
                s.sort(sortfunction);
                l.sort(sortfunction);
    
                var rgb = HSLToRGB(h[4],s[4],l[4]);
    
                var red = rgb[0];
                var green = rgb[1];
                var blue = rgb[2];
                img.setPixel(i, j, new RGBColor(red, green, blue));
    
            }
        }
    
        ctx.putImageData(img.imageData, 0, 0);
        photoPreview.src = canvas.toDataURL()
}
// Filtros (Media)
const meanSuavization= document.getElementById('meanSuavization')
 meanSuavization.onclick  = function(){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
            var pixel = Array();
            //pegando os pixels do kernel e colocando no array pixel
            pixel.push(img.getPixel(i-1,j-1));
            pixel.push(img.getPixel(i-1,j));
            pixel.push(img.getPixel(i-1,j+1));
            pixel.push(img.getPixel(i,j-1));
            pixel.push(img.getPixel(i,j));
            pixel.push(img.getPixel(i,j+1));
            pixel.push(img.getPixel(i+1,j-1));
            pixel.push(img.getPixel(i+1,j));
            pixel.push(img.getPixel(i+1,j-1));

            var reds = Array();
            var greens = Array();
            var blues = Array();

            for(var x = 0; x < pixel.length; x++){
                reds.push(pixel[x][0]);
                greens.push(pixel[x][1]);
                blues.push(pixel[x][2]);
            }

            var red = reds.reduce((a, b) => a + b, 0) / 9;
            var green = greens.reduce((a, b) => a + b, 0) / 9;
            var blue = blues.reduce((a, b) => a + b, 0) / 9;


            img.setPixel(i, j, new RGBColor(red, green, blue));
        }
    }
    ctx.putImageData(img.imageData, 0, 0);
    photoPreview.src = canvas.toDataURL()
}
//Conversão em tons de cinza (Média)
const grayScaleMean = document.getElementById('grayScaleMean')
grayScaleMean.onclick = function(){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
            var pixel = img.getPixel(i,j);
            var gray = (pixel[0] + pixel[1] + pixel[2]) / 3; 
            img.setPixel(i, j, new RGBColor(gray, gray, gray));
        }
    }
    ctx.putImageData(img.imageData, 0, 0);
    photoPreview.src = canvas.toDataURL()
}
//Conversão em tons de cinza (NTSC)
const grayScaleNTSC = document.getElementById('grayScaleNTSC')
grayScaleNTSC.onclick = function(){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {
            var pixel = img.getPixel(i,j);
            var gray =pixel[0]*0.299 + pixel[1]*0.587 + pixel[2]*0.144
            img.setPixel(i, j, new RGBColor(gray, gray, gray));
        }
    }
    ctx.putImageData(img.imageData, 0, 0);
    photoPreview.src = canvas.toDataURL()
}
//Limiar (Binarização) manual
const limiarização = document.getElementById('limirizacao')
limiarização.onclick = function(){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let img = new MatrixImage(imageData);
    let black = 0;
    let white = 255;
    let threshold = 121;

    for (var i = 0; i < img.width; i++) {
        for (var j = 0; j < img.height; j++) {

            var pixel = Array();

            pixel.push(img.getPixel(i,j));

            var mean = pixel[0][0]*0.299 + pixel[0][1]*0.587 + pixel[0][2]*0.144;

            if(mean < threshold){
                img.setPixel(i,j, new RGBColor(white, white, white));
            }else{
                img.setPixel(i,j, new RGBColor(black, black, black));
            }

        }
    }
    ctx.putImageData(img.imageData, 0, 0);
    photoPreview.src = canvas.toDataURL()
}
//rotacao 90°
const rotateButton90 = document.getElementById('rotateImage90')
rotateButton90.onclick = function(){
    photoPreview.style.transform = 'rotate(90deg)'
}
//rotacao 180°
const rotateButton180 = document.getElementById('rotateImage180')
rotateButton180.onclick = function(){
    photoPreview.style.transform = 'rotate(180deg)'
}
//rotacao 270°
const rotateButton270 = document.getElementById('rotateImage270')
rotateButton270.onclick = function(){
    photoPreview.style.transform = 'rotate(270deg)'
}
//rotacao 0°
const rotateButton0 = document.getElementById('rotateImage0')
rotateButton0.onclick = function(){
    photoPreview.style.transform = 'rotate(0deg)'
}
//reload image
const atualizarPagina = document.getElementById('reload')
atualizarPagina.onclick = function(){
    ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    photoPreview.src = canvas.toDataURL()
} 

//renderizacao 4X
/*const rend4X = document.getElementById('rend4X')
rend4X.onclick = function(){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var maxWidth = imageData.width*4;
    var maxHeight = imageData.height*4;
    var width = imageData.width;
    var height = imageData.height;

    if (width > height) {
        if (width < maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
        }
    } else {
        if (height < maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
        }
    }

    imageData.width, canvas.width = width;
    imageData.height, canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);
    photoPreview.src = canvas.toDataURL()
}
*/

//renderizacao 2X
/*const rend2X = document.getElementById('rend2X')
rend2X.onclick = function(){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var maxWidth = imageData.width*2;
    var maxHeight = imageData.height*2;
    var width = imageData.width;
    var height = imageData.height;

    if (width > height) {
        if (width < maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
        }
    } else {
        if (height < maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
        }
    }

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0, width, height);
    photoPreview.src = canvas.toDataURL()
}
*/
