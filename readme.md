# analytix-docs Documentation Site

This repository is using the [docusaurus.io](https://docusaurus.io/) package to create the website for analytix-docs that is deployed.

For details on building and deploying the static website to **heroku**, please see the [analytix-docs-build](https://github.com/analytixncs/analytix-docs-build) repository.

The deployed static website is located at [https://analytix-docs.herokuapp.com/index.html](https://analytix-docs.herokuapp.com/index.html)

## General Layout of Application

There are two primary directories that contain data to be changed:

1. **docs** - This directory contains all of the documentation and assets that you want to make available.
2. **website** - This directory contains the layout of the website and configuration files.

## docs Section

As stated above, all of the documentation, downloadable files or images will be located in the
 `analytix-docs/docs/` folder.

The current structure inside this folder is as follows:

![](https://dl.dropboxusercontent.com/s/hh1vsvit3zz3ny8/DOCUSAURUS_gitreadme3.png)

First, notice that all documentation files that you want displayed on the static site must be in Markdown format.  If you don't know Markdown, this free 30 minute course will tell you most of what you need to know. 

[Mastering Markdown](https://masteringmarkdown.com/)

The **analytix**, **bi**, and **support** directories were created to try and organize the documents.  The **analytix** and **bi** directories are focused on documentation specific to each of those categories, whereas the **support** directory is a catch all.  There can be **NO** sub directories in these folders.  

The **assets** folder is where ALL of the images for the documents in the other directories reside.  Also, there is a **downloads** folder in the **assets** directory.  This is where you will put your downloadable assets.

## Creating Markdown Docs

You will use standard markdown to write your docs, but there are few things you can do that will make the workflow a bit smoother.

### Docs Header

The header of the markdown docs in the /docs/ directory is YAML front matter.  Start with three hyphens followed by id, title, and sidebar_label

```yaml
---
id: filename-works
title: Title to See
sidebar_label: Link in Sidebar
---
```

The `id`must be unique across all documents within a folder.

`title` will be made the "h1" title for the document.

`sidebar_label` is what will show on the sidebar for the document.

### Images

Gotta have images in our docs.  

The images for all documents will be located in the **/docs/assets** folder in the docs folder.  This is where **ALL**  of the images are.  

> You could create subdirectories in here to match the directory structure for your markdown, but I have opted to just use the image name to differentiate.

To use an image from this directory, simply access using the relative path.  Given that we have subdirectories in the **docs** folder for all of our documentation, the relative path to the assets directory would be `../assets/someimage.png`

The actual image Markdown would look like this:

```markdown
![](../assets/someImage.png)
```

### Downloadable Files

There are times when you want a file to be downloaded, either a PDF, Excel, MP3, etc.  You can achieve this in two ways.

The first uses standard markdown formatting:

```markdown
[BI Schema Spreadsheet](../assets/downloads/AdBase_Schema_v2016-1(273).xlsx)
```

The downside with the above, is that for certain types, like PDF or mp3's, it will simply try and open the file.  The user can right click and choose "File Save as...", but if you want to force a download, you can inject standard HTML into your markdown doc:

```html
<a href="../assets/downloads/AdBase_Schema_v2016-1(273).xlsx" download>Click to Download</a> 
```

The other question you should be asking is "where do my download live?"

From what I can see in docusaurus, you will need to keep any type of asset in the assets folder that is in (i.e. you create in) the docs folder.

### Links to Other Documents

It is very simple to link to other documents that are in the Docs folder.  You will need to be aware if they are in different directories.

But first, the easiest case.  You want to link to another document that is in the current directory.

```markdown
[dmUser](bi-database-core-mapping#dmuser)
```

Now, if you want to link to a document that is in a sub directory of Docs, then you just need to make sure you use the relative path to point to that doc.  Below is an example that assumes we are linking for a doc in the BI sub directory.

```markdown
[AdminGuide](../analytix/analytix-admin-guide)
```



## General Site Configuration

This documentation site is based on the [docusaurus.io](https://docusaurus.io/) package.  For more details on using and modifying the site, refer to the [docusaurus documentation](https://docusaurus.io/docs/en/installation).

### siteConfig.js

Located in the **website** directory, the siteConfig.js lets you define a number of defaults for you site.

It is here you will configure the following:

- Your websites title and tagline
- The website URL and BaseURL
- The header links
- The header and footer icons as well as the favicon
- Primary colors for the website
- Copyright information
- Other stuff...

> The right side menu was enabled by adding the following to the siteConfig `onPageNav: 'separate', ` 

------

### sidebars.json

Also in the **website** directory, the sidebars.json file defines the you sidebar structure and what docs appear in them.

The json looks like this:

```json
{
  "analytix": {
    "Analytix Intro": [
      "analytix/analytix-bi-overview"
    ],
    "Analytix Setup/Main": [
      "analytix/analytix-preinstall-checklist", 
      "analytix/analytix-install",
      "analytix/analytix-setup",
      "analytix/analytix-admin-guide"    
    ],
    "Analytix User Guides": [
      "analytix/analytix-salesflash-userguide"
      
    ],
    "Analytix Developer Guides": [
      "analytix/analytix-salesflash-developerguide",
      "analytix/analytix-training-aggr-function",
      "analytix/analytix-training-set-analysis",
      "analytix/analytix-balance-to-gl",
      "analytix/analytix-exchange-rate"
    ], 
    "Analytix Support Docs": [
      "analytix/analytix-using-accesspoint",
      "analytix/analytix-salesflash-vs-advertisinganalytix",
      "analytix/analytix-help-advanced-search",
      "support/qlikview-license-management",
      "support/qlikview-bookmark-management",
      "support/qlikview-reduce-data"
    ]
  },
  "bi": {
    "BI Maintenance": [
      "bi/bi-database-core-mapping",
      "bi/bi-auditors"
    ],
    "BI Resources": [
      "bi/bi-resources"
    ],
    "BI Support Docs": [
      "support/bi-chargetypes"
    ]
  }
}

```

The ***analytix*** and ***bi*** properties are not shown anywhere in the site, but are used to hold the different groups of documentation.  They create two distinct documentation page groups.

The final output looks like:

![](https://dl.dropboxusercontent.com/s/h6z2wck1d03wbm9/DOCUSAURUS_gitreadme1.png)



![](https://dl.dropboxusercontent.com/s/x0gy7zwv2b7d0nq/DOCUSAURUS_gitreadme2.png)

So in the screenshots above you are seeing all the items pertaining to the **"analytix"** group and the **"bi"** group as listed in the json file.  If you were to link to any document listed in the **"bi"** group you would get a page that had the "bi" sidebar info on it.

The object properties under each of the groups makes up the sidebars headers.  This allows you to group your documentation as you see fit.  The **array** under each of these headers are the docs that fall under that header.

> The sidebar links for each doc comes from that YAML front matter meta data.   Specifically the "sidebar_label".

Next, how do you access these docs from places other than the sidebar? You will have to access them via a link at some point to get to the page with the sidebar.  This is done in different ways depending on where you are.

------

### Main Page - Index.js

The main entry point of the site is the **Index.js** file located in `/website/pages/en`

This is a react file with a lot of defaults.  I have narrowed it down to just the basics.  If you go to the **Index** class at the end of the file:

```javascript
class Index extends React.Component {
  render() {
    let language = this.props.language || '';

    return (
      <div>
        <HomeSplash language={language} />
        <div className="mainContainer">
        {/*
            <Features />
            <FeatureCallout />
          <LearnHow />
          <TryOut />
          <Description />*/
          }
          <Resources />
        </div>
      </div>
    );
  }
```

Notice that I am only using the **HomeSplash** and **Resources** components.  

### Linking to Docs or Assets in Index.js

If you want to link to a downloadable asset that is in the **docs/assets** directory, you can access by using the relative link to your asset.

Here is the Resource component:

```javascript
const Resources = () => {
  return (
    <div className="productShowcaseSection paddingBottom">
      <h2>Resources</h2>
      <div className="resource-container">
        <div className="resource-container__group">
          <ul className="resource-container__list">
            <li><a href="docs/assets/downloads/AGGR-AdvancedTraining.pdf">Set Analysis</a></li>
            <li><a href="docs/assets/downloads/SetAnalysis-AdvancedTraining.pdf">AGGR</a></li>
          </ul>
        </div>
        <div className="resource-container__group">
          <ul className="resource-container__list">
            <li><a href="https://community.qlik.com/welcome" target="_blank">Qlik Community</a></li>
            <li><a href="http://www.naturalsynergies.com/blog/" target="_blank">Natural Synergies Blog</a></li>
            <li><a href="https://www.askqv.com/blogs/">Top 40 Qlik Blogs</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
};
```

However, if you want to link to a Markdown documentation file in the index.js, you will use the following:

```javascript
<Button href={docUrl('analytix/analytix-bi-overview.html')}>Analytix</Button>
```

The `docUrl()` function is defined in the index.js file and just formats the link to include the baseURL (our site is just '/') and also a language, which we only have English, so alternatively we could write the following:

```javascript
<Button href={'docs/analytix/analytix-bi-overview.html'}>Analytix</Button>
```



### Active Link CSS

You can put custom CSS to style the active document sidebar link.

This will be added to the `customer.css` file located in `/website/static/css/`

```css
.navItemActive {
    background: lightyellow;
    border: 1px dashed lightblue !important;
    font-weight: bold;
    padding-left: 10px !important;
}
```

