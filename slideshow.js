/*

###    SUPER-SIMPLE SLIDESHOW by aurelienshz    ###

Distributed under The MIT License (MIT).
tl;dr : you're free to do anything you want with the code as long as you provide attribution back to me and don’t hold me liable.
See LICENSE file in the repo.

Copyright (c) 2015 Aurélien Schiltz - All Rights Reserved.

*/

function Slideshow(container) {
    this.container = container;
    this.currentSlide = 0;
    this.slides = [];
    this.playing = true;
    this.nav = '';

    /**********************************************/
    /*** Méthodes d'initialisation du slideshow ***/
    /**********************************************/
    // Récupérer les slides :
    this.getSlides = function() {
        for(var i in this.container.childNodes) {
            if(this.container.childNodes[i].tagName == 'DIV') {
                var slide = this.container.childNodes[i];
                this.slides.push(slide);
                container.removeChild(slide);
            }
        }
        var slidesContainer = document.createElement('DIV');
        slidesContainer.className = 'slideshow-slides';
        for(i in this.slides) {
            slidesContainer.appendChild(this.slides[i]);
        }
        this.container.insertBefore(slidesContainer, this.container.childNodes[1]);
    }
    // Initialiser le slideshow :
    this.init = function() {
        // on cache tout le monde
        for(var i in this.slides) {
            this.slides[i].style.display = 'none';
        }
        // on réaffiche le premier slide
        this.slides[this.currentSlide].style.display = 'block';
        this.activateNav(this.currentSlide);
    }

    // Ajouter les "nav" --> accès directs aux suggestions (points cliquables)
    // Wanted : un meilleur nom pour cette fonctionnalité (autre que "nav").
    this.addScrolls = function() {
        var scrollLeft = document.createElement('DIV'),
            scrollRight = document.createElement('DIV');
        scrollLeft.className = 'previous';
        scrollLeft.innerHTML = '<span>&lt;</span>';
        scrollRight.className = 'next';
        scrollRight.innerHTML = '<span>&gt;</span>';

        this.container.insertBefore(scrollRight, container.childNodes[0]);
        this.container.insertBefore(scrollLeft, container.childNodes[0]);

        return [scrollLeft, scrollRight];
    }

    this.addNav = function() {
        var nav = document.createElement('DIV');
        nav.className = 'slideshow-nav';
        for(var i in this.slides) {
            icon = document.createElement('SPAN');
            icon.className = 'nav';
            nav.appendChild(icon);
        }
        container.appendChild(nav); //, container.childNodes[0]
    }
    // Ajouter les interactions sur les boutons de défilement
    this.addInteractions = function() {
        var currentSlideshow = this,
            defilements = this.addScrolls();
        this.addNav(); // ToDo : catch the nav element and add direct navigation on click on the nav dot

        for(var i=0, c=defilements.length; i<c; i++) {
            defilements[i].addEventListener('click', function(e) {
                currentSlideshow.pause();
                if(e.target.className=='next') {
                    currentSlideshow.next();
                }
                else if(e.target.className=='previous') {
                    currentSlideshow.previous();
                }
                e.preventDefault;
            }, false);
        }
    }

    /*****************************************/
    /*** MÉTHODES DE CONTROLE DU SLIDESHOW ***/
    /*****************************************/
    // Slide précédent :
    this.previous = function() {
        this.showSlide(this.currentSlide-1);
    }
    //Slide suivant :
    this.next = function() {
        this.showSlide(this.currentSlide+1);
    }
    //Mettre en pause :
    this.pause = function() {
        this.playing = false;
    }
    //Lire le slideshow :
    this.play = function() {
        var _this = this;
        setTimeout(function() {
            if(_this.playing) {
                _this.next()
                _this.play();
            }
        }, 3000);
    }
    // Afficher un slide particulier :
    this.showSlide = function(slide) {
        // Si on sort des limites, on réassigne le numéro de slide correctement :
        if(slide < 0 || slide >= this.slides.length) {
            while(slide < 0) {
                slide = this.slides.length + slide;
            }
            while(slide >= this.slides.length) {
                slide = slide % this.slides.length;
            }
        }


        // On *essaye* (avec douleur) d'animer la disparition du slide en cours :
        var slideFadingOut = this.slides[this.currentSlide];
        slideFadingOut.style.opacity = 1;
        // Durée de l'animation : 300ms
        // Temps d'une frame : 15ms
        // Pas d'opacité : 0.05
        var _this = this

        function fadeOut(){
            setTimeout(function(){
                var opa = slideFadingOut.style.opacity;
                if(opa > 0) {
                    slideFadingOut.style.opacity -= 0.05;
                    fadeOut();
                }
            },15);
        }
        fadeOut();
        var slideFadingIn = this.slides[slide];
        slideFadingIn.style.opacity = 0;

        setTimeout(function(){
            _this.slides[_this.currentSlide].style.display = 'none';
            _this.slides[slide].style.display = 'block';
            // On met à jour la valeur de currentSlide
            _this.currentSlide = slide;
            // On met à jour les points de positionnement
            _this.activateNav(slide);

            function fadeIn(){
                setTimeout(function(){
                    var opa = parseFloat(slideFadingIn.style.opacity);
                    if(opa < 1) {
                        slideFadingIn.style.opacity = opa + 0.05;   // J'ignore pourquoi on ne peut pas incrémenter directement style.opacity, mais ça ne fonctionne pas.
                        fadeIn();
                    }
                },15);
            }
            fadeIn();
        },300);     // Temps d'attente pour l'animation de fade out

    }
    this.activateNav = function(nav) {
        for(var i in this.container.childNodes) {
            if(this.container.childNodes[i].className == 'slideshow-nav') {
                for(var j in this.container.childNodes[i].childNodes) {
                    if(j==nav) {this.container.childNodes[i].childNodes[j].className = 'nav-active'; }
                    else {this.container.childNodes[i].childNodes[j].className = 'nav'; }
                }
            }
        }
    }

    // Et c'est parti pour créer le slideshow tout bien comme il faut :
    this.getSlides();
    this.addInteractions();
    this.init();
    this.play();
}




(function() {
	var slideshows = document.getElementsByClassName('slideshow'),
        running = [];
     for(var i = 0; i<slideshows.length; i++) {
        new Slideshow(slideshows[i]);
    }
})();
