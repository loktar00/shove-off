Shove Off Menu
===

### [Live Demo](loktar00.github.io/shove-off)

Shove Off Menu is a light-weight off-canvas menu that was born out of the frustration over other menus. This was originally inspired by the menu [pushy](https://github.com/christophery/pushy) however it bares little resemblence. I needed a menu that utilized css animations, was light weight, and was able to be used with Browserify. I also still wanted full control of the menu markup structure.

Currently Shove Off does have a jQuery dependancy but its something I'm considering moving in the near future.

Usage
---

Call the menu plugin on your navigation

`$('.mobile-navigation').shoveoff();`

Currently there are only two options `menuSpeed`, and `menuWidth` and they are only used for the jQuery animation fallback when css transition support isn't detected.

Controlling Menu width
---

Shove Off uses less for its styles in order to control how far the menu opens you need only to modify `@mobile-menu-width` in `shoveoff.less`


CSS Classes and Elements
---

Shove Off adds a few css classes and one element in order to operate.

### Elements
            
`<div class="menu-blocker"></div>`

The div with the class menu blocker fills the page where the menu is not located, it captures the mousedown and touchstart events in order to close the menu.

### Classes

* `.menu-transition-animation` - Used to animate the menu transition
* `.shove-active` - Added to the body sets `overflow-x:hidden`
* `.shove` - Added to all elements except navigation in order to shove them over.
* `.offcanvas-left` - Added to the menu when its off the page
* `.offcanvas-open` - Added to the menu to bring it onto the page