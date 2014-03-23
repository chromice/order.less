# order.less

order.less is a library of Less mixins that give you precise control over basic elements of  typographic rhythm: grid, baseline and scale.

## Grid

The grid module allows you define a column grid and set elements' width, padding, margin and offset in columns.

At the moment only symetric grids with inner gutters are supported, i.e. 3 column grid would have 2 gutters in between those columns. However, you can use any number of grids in your project, e.g. you may combine 5 and 3 column grids to achieve the effect of a compound grid.

In order to start using grid module, you must import the mixins and define the grid like this:

```less
@import 'path/to/grid.less';

.use-grid(
    12,   // number of columns in the grid
    20px, // gutter (pixels)
    940px // optimal grid width (pixels)
);
```

The third argument is only used in older browsers, which don't support `calc()`, to calculate fallback gutter width in percentages rather than fixed amount of pixels.

Now, let us create a 2:6:4 three column layout for this HTML:

```html
<main>
    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Products</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact us</a></li>
        </ul>
    </nav>
    <article>
        <h1>Main content</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </article>
    <aside>
        <h2>Sidebar</h2>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </aside>
</main>
```

The naive approach would be to use just floats, widths and margins like this:

```less
main {
    overflow: hidden; // clear the floated children
    
    > * {
        float: left;
    }
    
    > nav {
        .grid-width(2);
        .gutter-margin-right(1);
    }
    
    > article {
        .grid-width(6);
        .gutter-margin-right(1);
    }
    
    > aside {
        .grid-width(4);
    }
}
```

However, it will all fall apart, if there is more than one article. So here is a better way:

```less
main {
    overflow: hidden;      
    .grid-padding-left(2); // leave some space for navigation on the left hand side
                           // and reduce effective width to 10 columns.
    
    > * {
        float: left;
    }
    
    > nav {
        .grid-width(2, 10);
        .grid-margin-left(-2, 10);
    }
    
    > article {
        .grid-width(6, 10);
    }
    
    > aside {
        float: right;
        .grid-width(4, 10);
    }
}
```


## Scale

The scale module allows you to use double-stranded modular scales as described in [More Meaningful Typography](http://alistapart.com/article/more-meaningful-typography) by Tim Brown. 

```less
@import 'path/to/scale.less';

.use-scale(16px, 20px, 1.5);

html {
    font-size: @scale-base;
}
```

`.use-scale()` mixin accepts the same three arguments as [this tool](http://modularscale.com) and effectively produces [the same result](http://modularscale.com/scale/?px1=16&px2=20&ra1=1.5).

If you just want to pick a value from the scale and set the font size, you can do it like this:

```less
h1 {
    .scale-font-size(4);
}
```

Given the settings above, this will compile to:

```css
h1 {
    font-size: 36px;
    font-size: 2.25rem;
}
```


## Baseline

The baseline module lets you define the vertical rhythm, adjust elements' height, padding, margin and offset in baselines, and shift them so that they always sit on the baseline.

You can set the baseline font size in pixels like this:

```less
@import 'path/to/baseline.less';

.use-baseline(
    16px,  // baseline font size
    1.5,   // baseline height (ratio)
    0.3986 // baseline offset for Verdana (ratio)
);

html {
    font-family: Verdana, sans-serif;
    font-size: @baseline-font-size;
    line-height: @baseline-line-height;
}
```

Alternatively, you can combine baseline and scale like this:

```less
@import 'path/to/baseline.less';
@import 'path/to/scale.less';

.use-scale(16px, 20px, 1.5);
.use-baseline(@scale-base, 1.5, 0.3986);

html {
    font-family: Verdana, sans-serif;
    font-size: @baseline-font-size;
    line-height: @baseline-line-height;
}
```

Now you can set adjust font sizes and offsets of any element like this:

```less
@offset-gill-sans: 0.345;

h1, h2 {
    font-family: "Gill Sans", sans-serif;
}
h1 {
    .baseline-adjust(
        70px,             // adjusted font size (pixels or scale step)
        4/7,              // adjusted line height to baseline height ratio
        @offset-gill-sans // baseline offset for Gill Sans (a ratio)
    );
    .baseline-margin-top(1);
    .baseline-margin-bottom(1);
}
h2 {
    .baseline-adjust(@baseline-font-size, 5/4, @offset-gill-sans);
    .baseline-margin-top(1);
    .baseline-padding-bottom(0.10);
    border-bottom: 2px solid;
    .baseline-margin-bottom(0.9, -2px);
}
h3 {
    .baseline-adjust(12px, 4/3);
    .baseline-margin-top(1);
    .baseline-margin-bottom(0);
}
p {
    .baseline-margin-top(0);
    .baseline-margin-bottom(1);
}
```

## Future development

This library is nigh feature complete. However, I still need to document it extensively, add more tests and create a tool for calculating baseline offset value for any font.