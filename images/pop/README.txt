POPUP PICTURES / GIFS / VIDEOS (member cards)
=============================================
Put the files in this folder (images/pop). Use the names below.
The file type can be .mp4, .webm, .gif, .jpg, .jpeg, .png, or .webp.
(If you have both a video and a GIF with the same name, the video is used first.)

Names used on the page now:

  yejun-bubbles    Yejun: bubbles coming out of his mouth
  noah-sparkle     Noah: sparkles on his face when he laughs
  noah-heart       Noah: small heart when he winks
  bamby-flowers    Bamby: flowers around his face
  eunho-fire       Eunho: fire in his hand
  eunho-eyes       Eunho: glowing eyes
  hamin-binary     Hamin: binary numbers (0 and 1) when he opens his mouth or thinks
  hamin-copy       Hamin: using another member's ability

Not used on the page now (you can delete them from the HTML if you do not want them):
  bamby-harley, hamin-taekwondo, hamin-bamline

HOW TO ADD OR CHANGE A POPUP WORD in members.html
-------------------------------------------------
Wrap the word like this:

  <span class="pop" data-media="hamin-binary" data-caption="Text under the picture" tabindex="-1" role="button">word</span>

  data-media    the file name WITHOUT the file type (hamin-binary).
                You can also write the full name with the type (hamin-binary.gif)
                to use exactly that file.
  data-caption  the text shown under the big picture.
  data-credit   (optional) the credit line. If you leave it out, it shows "(c) VLAST".
                Example: data-credit="GIF: @account (X) / (c) VLAST"

Mouse on the word = small preview. Click = big popup.

Tips: keep each file small (GIFs under about 3 MB; .mp4 or .webm are smaller than GIFs).
If a file is missing, there is no small preview, and the big popup says "image coming soon".
On GitHub, file names are case-sensitive: write them exactly the same in the HTML and in the folder.
