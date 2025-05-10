(function(storyContent) {

    var story = new inkjs.Story(storyContent);

    var storyContainer = document.querySelectorAll('#story')[0];

    document.addEventListener('keydown', function (event) {
        const storyContainer = document.querySelector('.story-container');
        const scrollAmount = 50;
      
        if (event.key === 'ArrowDown') {
          storyContainer.scrollTop += scrollAmount;
        } else if (event.key === 'ArrowUp') {
          storyContainer.scrollTop -= scrollAmount;
        }
      });
    

    function isAnimationEnabled() {
        return window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    }

    function showAfter(delay, el) {
        setTimeout(function() { el.classList.add("show") }, isAnimationEnabled() ? delay : 0);
    }

    function scrollToBottom() {
        // If the user doesn't want animations, let them scroll manually
        if (!isAnimationEnabled()) {
            return;
        }
        var start = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        var dist = document.body.scrollHeight - window.innerHeight - start;
        if( dist < 0 ) return;

        var duration = 300 + 300*dist/100;
        var startTime = null;
        function step(time) {
            if( startTime == null ) startTime = time;
            var t = (time-startTime) / duration;
            var lerp = 3*t*t - 2*t*t*t;
            window.scrollTo(0, start + lerp*dist);
            if( t < 1 ) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function continueStory() {
        // Display all paragraphs one at a time
        while (story.canContinue) {
            const paragraphText = story.Continue();
    
            const paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);
    
            // Trigger fade-in
            await delay(100); // slight delay before triggering animation
            paragraphElement.classList.add('show');
    
            await delay(500);
            paragraphElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
            // Wait for fade-in to complete before continuing
            await delay(800); // match your CSS transition time
        }
    
        // Then display choices
        for (const choice of story.currentChoices) {
            const choiceParagraph = document.createElement('p');
            choiceParagraph.classList.add('choice');
            choiceParagraph.innerHTML = `<a href="#">${choice.text}</a>`;
            storyContainer.appendChild(choiceParagraph);
    
            await delay(100);
            choiceParagraph.classList.add('show');
            choiceParagraph.scrollIntoView({ behavior: 'smooth', block: 'end' });

    
            // Add click event
            const anchor = choiceParagraph.querySelector("a");
            anchor.addEventListener("click", function (event) {
                event.preventDefault();
    
                // Remove old choices
                const existingChoices = storyContainer.querySelectorAll('p.choice');
                existingChoices.forEach(c => c.remove());
    
                // Continue story
                story.ChooseChoiceIndex(choice.index);
                continueStory();
            });
        }
    
        scrollToBottom();
    }
    
    
    /*
    function continueStory() {
        var paragraphIndex = 0;
        var delay = 0.0;
    
        // Generate story text - loop through available content
        while (story.canContinue) {
            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();
    
            // Create paragraph element
            var paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);
    
            // Fade in paragraph after a short delay
            setTimeout(function () {
                paragraphElement.classList.add('show');  // Trigger fade-in
            }, delay);
    
            delay += 1000;  // Adjust delay between paragraphs
    
        }
    
        // Create HTML choices from ink choices
        story.currentChoices.forEach(function (choice) {
            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`;
            storyContainer.appendChild(choiceParagraphElement);
    
            // Fade choice in after a short delay
            setTimeout(function () {
                choiceParagraphElement.classList.add('show');  // Trigger fade-in
            }, delay);
    
            delay += 1000;
    
            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function (event) {
                // Don't follow <a> link
                event.preventDefault();
    
                // Remove all existing choices
                var existingChoices = storyContainer.querySelectorAll('p.choice');
                for (var i = 0; i < existingChoices.length; i++) {
                    var c = existingChoices[i];
                    c.parentNode.removeChild(c);
                }
    
                // Tell the story where to go next
                story.ChooseChoiceIndex(choice.index);
    
                // Loop to continue the story
                continueStory();
            });
        });
    
        scrollToBottom();
    }
    */
    /*
    function continueStory() {

        var paragraphIndex = 0;
        var delay = 0.0;

        // Generate story text - loop through available content
        while(story.canContinue) {

            // Get ink to generate the next paragraph
            var paragraphText = story.Continue();

            // Create paragraph element
            var paragraphElement = document.createElement('p');
            paragraphElement.innerHTML = paragraphText;
            storyContainer.appendChild(paragraphElement);

            // Fade in paragraph after a short delay
            showAfter(delay, paragraphElement);

            delay += 200.0;
        }

        // Create HTML choices from ink choices
        story.currentChoices.forEach(function(choice) {

            // Create paragraph with anchor element
            var choiceParagraphElement = document.createElement('p');
            choiceParagraphElement.classList.add("choice");
            choiceParagraphElement.innerHTML = `<a href='#'>${choice.text}</a>`
            storyContainer.appendChild(choiceParagraphElement);

            // Fade choice in after a short delay
            showAfter(delay, choiceParagraphElement);
            delay += 200.0;

            // Click on choice
            var choiceAnchorEl = choiceParagraphElement.querySelectorAll("a")[0];
            choiceAnchorEl.addEventListener("click", function(event) {

                // Don't follow <a> link
                event.preventDefault();

                // Remove all existing choices
                var existingChoices = storyContainer.querySelectorAll('p.choice');
                for(var i=0; i<existingChoices.length; i++) {
                    var c = existingChoices[i];
                    c.parentNode.removeChild(c);
                }

                // Tell the story where to go next
                story.ChooseChoiceIndex(choice.index);

                // Aaand loop
                continueStory();
            });
        });

        scrollToBottom();
    }
    */
    continueStory();

})(storyContent);