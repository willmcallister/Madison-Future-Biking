# Explore the Future of Biking in Madison!


### Overview
Use our interactive map to view both upcoming changes to the bike network in Madison both at the site level and for the overall network.

### Team Members
 - Will McAllister
 - Ben Dimenstein


# Project Proposal

## User Persona and Scenarios
__User Persona:__
Reggie Belafonte is a young adult living in Madison, WI. He is very interested in the city planning process, but finds looking through city documents and presentations to be incredibly dull. When trying to conceptualize engineering drawings of specific plans, Reggie had a hard time visualizing the plans, especially contextualized with nearby features. He wishes to discover <ins>locations</ins> where the City of Madison plans to improve bicycle infrastructure in the city and <ins>compare</ins> both present to future of the overall bike network as well as specific sites across the city. Upon entering [exploring the future of biking in Madison app], he can see the present state of bicycle infrastructure in the city. He is an occasional biker and wants to see what infrastructure exists near his home that he has not biked on recently. To do this, he types in his home address in the <ins>search</ins> box and <ins>identifies</ins> the types of infrastructure nearby.


__Scenario 1:__
The first thing he wants to see is how the bike network will change in the future. To do this, he enables the <ins>juxtapose</ins> tool which overlays a vertical slider bar allowing him to slide between the present and future bike network layers to <ins>compare</ins> the two. He notices an area of town where a new separated bike path will be built. He becomes curious about this and wants to learn about how it will connect with existing infrastructure

__Scenario 2:__
Reggie is also interested in certain bike infrastructure projects that the city is planning to implement in the near future, especially ones around his neighborhood and workplace. When he located his neighborhood, he noticed changes coming to an intersection near his home. By clicking on the site, he is able to <ins>retrieve</ins> OR <ins>overlay</ins> (decision TBD) a new view <ins>comparing</ins> the proposed implementation of a protected bike lane in this nearby intersection to the current infrastructure. 


## Requirements Document

**Representation:**

<table>
  <tr>
   <td><strong>Feature</strong>
   </td>
   <td><strong>Description</strong>
   </td>
   <td><strong>Source</strong>
   </td>
  </tr>
  <tr>
   <td>Basemap
   </td>
   <td>Undistracting minimal basemap with roads and a muted color scheme, still provides context of areas of Madison
   </td>
   <td>Potentially CartoDB.Positron?
   </td>
  </tr>
  <tr>
   <td>Current Bike Routes
   </td>
   <td>Lines of current bike routes, symbolized by type (ex. On-street, protected, multi-use path, etc.)
   </td>
   <td>City of Madison/Greater Madison MPO
   </td>
  </tr>
  <tr>
   <td>Legend
   </td>
   <td>For current bike routes layer, hidden when looking at a particular site
   </td>
   <td>n/a
   </td>
  </tr>
  <tr>
   <td>Potential Sites Overview
   </td>
   <td>Potential sites symbolized by type (intersection, street block, etc.)
   </td>
   <td>City of Madison/Greater Madison MPO/UW FPM
   </td>
  </tr>
</table>


**Interaction:**


<table>
  <tr>
   <td><strong>Feature</strong>
   </td>
   <td><strong>Operator/Description</strong>
   </td>
  </tr>
  <tr>
   <td>Juxtapose Slider
   </td>
   <td>Compare. Juxtapose current and future bike layer by using a slider to view proposed changes
   </td>
  </tr>
  <tr>
   <td>Search Box
   </td>
   <td>Search. Allows users to search for their address to identify infrastructure near their home or a POI. (Would ideally like to constrain this to just the map extent and use a smart search to not allow a user to break the interface)
   </td>
  </tr>
  <tr>
   <td>Future Project List
   </td>
   <td>Retrieve. Provides flexibility by allowing users to jump directly to a project of interest by name instead of by location.
   </td>
  </tr>
  <tr>
   <td>Clicking on a site/project
   </td>
   <td>Zoom and Overlay. Zooms to the project location. The user can then click a button to either overlay the new design overtop of the site or open a pop-up with designs and details about the site (tbd will decide which is more feasible - would prefer to implement the overlay).
   </td>
  </tr>
  <tr>
   <td>Map Reset
   </td>
   <td>Zoom and Pan. Resets the map by zooming out to the default extent and removing any enabled overlays.
   </td>
  </tr>
  <tr>
   <td>Interface Tour
   </td>
   <td><em>*if time allows </em>Tour of a few selected sites similar to the functionality on the <em>Human Terrain</em> interactive.
   </td>
  </tr>
</table>


## Interface Mockups

![‎575 final ‎001](https://github.com/willmcallister/575_final_project/assets/94069278/93fe5701-9d4a-459c-8a30-d0a1b4a7cd0d)
*Juxtapose old and new bike network*


![‎575 final ‎004](https://github.com/willmcallister/575_final_project/assets/94069278/0a83ae07-0797-43ad-9656-9585f3d17cbf)
*Gain info about a particular site/project*


![‎575 final ‎002](https://github.com/willmcallister/575_final_project/assets/94069278/14021c5e-2436-431c-9649-b9ccdcaea8fc)
*Overlay option for a particular site/project*


![‎575 final ‎003](https://github.com/willmcallister/575_final_project/assets/94069278/a21ceb35-d746-428f-85b0-0de36ba37921)
*Tour of a few selected sites, if time allows*

