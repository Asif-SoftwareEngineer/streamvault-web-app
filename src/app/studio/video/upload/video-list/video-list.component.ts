import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VideoDataService } from 'src/app/services/videos-data.service';

@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss'],
})
export class VideoListComponent {
  videoFiles: any[] = [];
  uploadProgress: number = 0;
  isUploading: boolean = false;

  constructor(private router: Router, private videoService: VideoDataService) {}

  onFilesChanged(event: any) {
    const fileList = event.target.files;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.type.startsWith('video/')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;

          const video = {
            name: file.name,
            thumbnail: '',
            url: dataUrl,
          };

          this.generateVideoThumbnail(file, (thumbnailUrl: string) => {
            video.thumbnail = thumbnailUrl;
            this.videoFiles.push(video);
            this.validateImageUrl(video.thumbnail)
              .then(() => {
                // Perform additional logic or actions here
              })
              .catch(() => {
                //Load a default video thumbnail
              });
          });
        };

        reader.readAsDataURL(file);
      }
    }
  }

  navigateToPreUploadVideoPage(videoUrl: string, videoThumbnail: string) {
    this.videoService.setThumbnailBase64(videoThumbnail);
    this.videoService.setVideoBase64(videoUrl);
    // You can navigate to the video page using the video URL
    this.router.navigateByUrl('studio/pre-upload-video');
  }

  generateVideoThumbnail(file: File, callback: Function) {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.addEventListener('loadeddata', () => {
      video.currentTime = 5; // Seek to 5 seconds
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);

        callback(canvas.toDataURL());
      });
    });
    video.src = URL.createObjectURL(file);
  }

  validateImageUrl(imageUrl: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = imageUrl;
    });
  }
}
