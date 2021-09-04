NAME	?= home
ORG	?=
REPO    ?=

ifeq (${REPO},)
REPO	:= ${ORG}/${NAME}
ifeq (${ORG},)
REPO	:= ${NAME}
endif
endif
# Use latest tag if VERSION is null
ifeq (${HASH},)
HASH := $(shell git rev-parse --short HEAD 2>/dev/null)
endif
ifeq (${HASH},)
HASH := nil
endif
ifeq (${VERSION},)
BUILD_DATE_SHORT := $(shell date "+%Y%m%d" 2>/dev/null)
VERSION := ${BUILD_DATE_SHORT}-${HASH}
endif

TAG_BUILD	:= ${REPO}:${HASH}
TAG_RELEASE := ${REPO}:${VERSION}

all: run

run:
	npm start

build-image:
	docker build -t ${TAG_BUILD} --build-arg=HASH=$(HASH) .
	docker tag ${TAG_BUILD} ${TAG_RELEASE}

push-image:
	docker push ${TAG_RELEASE}
